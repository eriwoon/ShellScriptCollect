#!/usr/bin/env python
# coding=utf-8
'''
Created on 2015-4-5

@author: x00194181
'''
from __future__ import unicode_literals, print_function, division
import os, sys
from tkframwork import PcapProcess


class MyCanvasList():
    '''
    classdocs
    '''


    def __init__(self, filename = None):
        START = 'start'
        END   = 'end'
        TEXT  = 'text'
        
        if(filename == None):
            self.nodes = ["192.168.100.100", "192.168.100.101", "1.1.1.1"]
            self.lines = [
                {START: 0, END: 1, TEXT: '123'},
                {START: 1, END: 2, TEXT:  '456'},
                {START: 2, END: 1, TEXT:  '654'},
                {START: 1, END: 0, TEXT:  '432'}]
        else:
            ret = PcapProcess.main(filename)
            self.nodes = ret.nodes
            self.lines = ret.lines
            
def main():
    myCanvasList = MyCanvasList('1.pcap')
    

if __name__ == "__main__":
    os.chdir(os.path.dirname(sys.argv[0]))
    main()
    
