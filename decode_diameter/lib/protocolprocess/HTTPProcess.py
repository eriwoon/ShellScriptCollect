#!/usr/bin/env python
# coding=utf-8
from __future__ import unicode_literals, print_function, division

import sys
from pcapparser import utils
from pcapparser.printer import HttpPrinter
from pcapparser.httpparser import HttpType, HttpParser

class HttpConn:
    """all data having same source/dest ip/port in one http connection."""
    STATUS_BEGIN = 0
    STATUS_RUNNING = 1
    STATUS_CLOSED = 2
    STATUS_ERROR = -1

    def __init__(self, tcp_pac):
        self.source_ip = tcp_pac.source
        self.source_port = tcp_pac.source_port
        self.dest_ip = tcp_pac.dest
        self.dest_port = tcp_pac.dest_port

        self.status = HttpConn.STATUS_BEGIN

        # start parser thread
        self.processor = HttpPrinter((self.source_ip, self.source_port),
                                     (self.dest_ip, self.dest_port))
        self.http_parser = HttpParser(self.processor)
        self.append(tcp_pac)

    def append(self, tcp_pac):
        if len(tcp_pac.body) == 0:
            return
        if self.status == HttpConn.STATUS_ERROR or self.status == HttpConn.STATUS_CLOSED:
            # not http conn or conn already closed.
            return

        if self.status == HttpConn.STATUS_BEGIN:
            if tcp_pac.body:
                if utils.is_request(tcp_pac.body):
                    self.status = HttpConn.STATUS_RUNNING
        if tcp_pac.source == self.source_ip:
            http_type = HttpType.REQUEST
        else:
            http_type = HttpType.RESPONSE

        if self.status == HttpConn.STATUS_RUNNING and tcp_pac.body:
            self.http_parser.send(http_type, tcp_pac.body)

        if tcp_pac.pac_type == -1:
            # end of connection
            if self.status == HttpConn.STATUS_RUNNING:
                self.status = HttpConn.STATUS_CLOSED
            else:
                self.status = HttpConn.STATUS_ERROR

    def finish(self):
        self.http_parser.finish()

