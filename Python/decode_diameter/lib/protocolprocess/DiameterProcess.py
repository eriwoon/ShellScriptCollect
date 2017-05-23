#!/usr/bin/env python
# coding=utf-8
from __future__ import unicode_literals, print_function, division

import sys
import binascii
from diameterparser.decode_diameter import decode_diameter

def convertMac(octet):
    mac = [binascii.b2a_hex(x) for x in list(octet)]
    return "".join(mac)
    
class DiameterConn:
    def __init__(self):
        self.diameter = decode_diameter()
    
    def decode(self, input_hex):
        headerinfo, tree = self.diameter.decode(convertMac(input_hex))
        return headerinfo, tree
        
        