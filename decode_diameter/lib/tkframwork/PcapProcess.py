#!/usr/bin/env python
# coding=utf-8
#from __future__ import unicode_literals, print_function, division
import os
import sys
import struct
from pcapparser.constant import FileFormat
from pcapparser import config
from pcapparser import packet_parser
from pcapparser import pcap, pcapng, utils
from protocolprocess.HTTPProcess import HttpConn
from protocolprocess.DiameterProcess import DiameterConn
from collections import OrderedDict


class Message:
    def __init__(self):
        self.type = None
        self.sourceIP = None
        self.destIP = None
        self.sourcePort = None
        self.destPort = None
        self.Timestamp = None #UTC
        self.HTTSerialNo = None
        self.body = None


# check python version
major, minor = sys.version_info[:2]
if major != 2 or minor < 7:
    print("Python version 2.7.* needed.")
    sys.exit(1)


def get_file_format(infile):
    """
    get cap file format by magic num.
    return file format and the first byte of string
    """
    buf = infile.read(4)
    magic_num, = struct.unpack(b'<I', buf)
    if magic_num == 0xA1B2C3D4 or magic_num == 0x4D3C2B1A:
        return FileFormat.PCAP, buf
    elif magic_num == 0x0A0D0D0A:
        return FileFormat.PCAP_NG, buf
    else:
        return FileFormat.UNKNOWN, buf


def process_pcap_file(conn_dict, infile):
    file_format, head = get_file_format(infile)
    if file_format == FileFormat.PCAP:
        pcap_file = pcap.PcapFile(infile, head).read_packet
    elif file_format == FileFormat.PCAP_NG:
        pcap_file = pcapng.PcapngFile(infile, head).read_packet
    else:
        print("unknown file format.")
        sys.exit(1)

    #used for diameter decode
    diameterConn = DiameterConn()

    _filter = config.get_filter()
    for tcp_pac in packet_parser.read_package_r(pcap_file):
        # filter
        if not (_filter.by_ip(tcp_pac.source) or _filter.by_ip(tcp_pac.dest)):
            continue
        if not (_filter.by_port(tcp_pac.source_port) or _filter.by_port(tcp_pac.dest_port)):
            continue

        #IP Protocol
        if(tcp_pac.source_port == 8083 or tcp_pac.dest_port == 8083):
            key = tcp_pac.gen_key()
            # we already have this conn
            if key in conn_dict:
                conn_dict[key].append(tcp_pac)
                # conn closed.
                if tcp_pac.pac_type == packet_parser.TcpPack.TYPE_CLOSE:
                    print("xiaozhen: http_parser")

                    for package in conn_dict[key].http_parser.tcp_pac_list:
                        print("xiaozhen: package")
                        msg = Message()
                        print(package)
                        print("xiaozhen: package finishe")
                        msg.type = 'HTTP'
                        msg.sourceIP = package[1]
                        msg.sourcePort = package[2]
                        msg.destIP = package[3]
                        msg.destPort = package[4]
                        msg.body = package[0].body

                    del conn_dict[key]

            # begin tcp connection.
            elif tcp_pac.pac_type == 1:
                conn_dict[key] = HttpConn(tcp_pac)
            elif tcp_pac.pac_type == 0:
                # tcp init before capture, we found a http request header, begin parse
                # if is a http request?
                if utils.is_request(tcp_pac.body):
                    conn_dict[key] = HttpConn(tcp_pac)

        elif(tcp_pac.source_port in (6553,16553) or tcp_pac.dest_port in (6553,16553)):
            if len(tcp_pac.body) > 20:
                version = struct.unpack('!b',tcp_pac.body[0:1])[0]
                message_length = struct.unpack('!I',b'\x00' + tcp_pac.body[1:4])[0]
                Command_Flags = struct.unpack('!b',tcp_pac.body[4:5])[0]
                command_code = struct.unpack('!I',b'\x00' + tcp_pac.body[5:8])[0]
                application_ID, hop_by_hop_ID, end_to_end_ID = struct.unpack('!III', tcp_pac.body[8:20])

                if(version == 1 and command_code == 272):
                    #print(version, message_length, command_code)
                    headerinfo, tree = diameterConn.decode(tcp_pac.body)
                    for avp in tree:
                        avp.output()

def main(filename = None):

    if(filename == None):
        filename = '1.pcap'

    _filter = config.get_filter()
    conn_dict = OrderedDict()
    config.out = sys.stdout
    try:
        infile = open(filename, "rb")
        try:
            ret = process_pcap_file(conn_dict, infile)
        finally:
            infile.close()
    finally:
        for conn in conn_dict.values():
            conn.finish()

    return ret

if __name__ == "__main__":
    os.chdir(os.path.dirname(sys.argv[0]))
    try:
        main()
    except IOError as e:
        pass
