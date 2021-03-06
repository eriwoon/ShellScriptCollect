#!/usr/bin/env python
# coding=utf-8
'''
Created on 2015-4-5

@author: x00194181
'''
from __future__ import unicode_literals, print_function, division
import os, sys
from tkframwork import PcapProcess
from collections import OrderedDict

class MyCanvasList():
    '''
    classdocs
    '''


    def __init__(self, filename = None):
        START = 'start'
        END   = 'end'
        TEXT  = 'text'
        TYPE  = 'type'
        INFO  = 'INFO'

        if(filename == None):
            self.nodes = ["192.168.100.100", "192.168.100.101", "1.1.1.1"]
            self.lines = [
                {START: 0, END: 1, TEXT: '123'},
                {START: 1, END: 2, TEXT:  '456'},
                {START: 2, END: 1, TEXT:  '654'},
                {START: 1, END: 0, TEXT:  '432'}]
        else:
            self.nodes = []
            self.lines = []
            conn_dict = OrderedDict()
            infile = open(filename, "rb")
            for msg in PcapProcess.process_pcap_file(conn_dict, infile):
                if msg.sourceIP not in self.nodes:
                    self.nodes.insert(0, msg.sourceIP)
                if msg.destIP not in self.nodes:
                    self.nodes.append(msg.destIP)

                self.lines.append({START: msg.sourceIP,
                                   END:   msg.destIP,
                                   TEXT:  msg.body,
                                   TYPE:  msg.type})


            dic_node = {}
            for i in range(len(self.nodes)):
                dic_node[self.nodes[i]] = i

            for record in self.lines:
                record[START] = dic_node[record[START]]
                record[END]   = dic_node[record[END]]


def main():
    myCanvasList = MyCanvasList('1.pcap')
    

if __name__ == "__main__":
    os.chdir(os.path.dirname(sys.argv[0]))
    main()
    
