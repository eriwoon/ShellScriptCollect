#-------------------------------------------------------------------------------
# Name:        Decode Diameter
# Purpose:
#
# Author:      XIAO Zhen
#
# Created:     08/10/2014
# Copyright:   (c) XIAO Zhen 2014
# Licence:     MIT License
#-------------------------------------------------------------------------------
#!/usr/bin/env python

import os
import sys

def logerr(msg):
    print "Error: " + msg
def loginfo(msg):
    print "Info : " + msg
def output(msg):
    print msg


def loadAvpDefineFile(filename):
    d = dict()

    try:
        file = open(filename,'r')
    except:
        logerr("Cannot open file:" + filename)
        return d

    cur_avp = '-1'
    detail = []
    for line in file.readlines():
        if(line[:4] == 'avp '):
            if(cur_avp != '-1'):
                d[cur_avp] = detail
            detail = []

            cur_avp = line.split()[1]
            if(cur_avp in d):
                cur_avp = '-1'

        elif(line.find("VENDOR_ID") != -1 and cur_avp != '-1'):
            cur_avp += ':' + line.split()[2][:-1]

        elif(line.find('DATA_TYPE') != -1):
            detail.append(line.split()[2][:-1])

        elif(line.find('AVP_NAME') != -1):
            detail.append(line.split()[2][1:-2])

    file.close()
    return d

def decode(avps,hex):
    '''
    0. Grouped
    1. OctetString
    2. OctetString
    3. Int32
    4. Int64
    5. UInt32
    6. UInt64
    9. Address
    10.Time
    11.Diameter-Identify
    12.DiameterURI
    13.Enum
    459:0
    ['13', 'User-Equipment-Info-Type']
    '''
    i = 0
    if(hex[i:i + 2] != '01'):
        logerr("This is not a diameter message!")
        return
    i += 2

    offset = []
    offset.append(eval('0x' + hex[i:i+6]) - 8)
    




def main():
    #use the the directory where the script located as current work dir
    os.chdir(os.path.dirname(sys.argv[0]))

    #load the avp define file
    file_name_avp_define = "Avpdefine.avp"
    avps = loadAvpDefineFile(file_name_avp_define)

    i = 0
    for avp in avps:
        print avp
        print avps[avp]
        i += 1
        if(i == 10):
            break

    hex = '-'
    decode(avps,hex)


if __name__ == '__main__':
    main()
