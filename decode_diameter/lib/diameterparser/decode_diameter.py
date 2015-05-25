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
import Tkinter as tk
import ttk
import time

class myException(BaseException):
    pass

def logerr(msg):
    print "Error: " + msg
def loginfo(msg):
    print msg
    pass
def output(msg):
    print msg

def intToIP(num):
    s = []
    for i in range(4):
        s.append(str(num %256))
        num /= 256
    return '.'.join(s[::-1])

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
            type = line.split()[2][:-1]
            detail.append(line.split()[2][:-1])

        elif(line.find('AVP_NAME') != -1):
            detail.append(line.split()[2][1:-2])

    file.close()
    return d


class AVP:
    def __init__(self):
        self.offset   = -1
        self.code     = -1
        self.flag     = []
        self.length   = -1
        self.venderid = 0
        self.value    = ""
        self.datatype = ""
        self.name     = ""
    def output(self):
        tmp = self.offset
        s   = ""
        while(tmp > 1):
            s += '\t'
            tmp -= 1

        s += "%s(%d:%d) t=%s l=%d "%(self.name,self.code,self.venderid,self.datatype, self.length)

        if(self.datatype != '0'):
            s+= "val=" + self.value;
        loginfo(s)
        return s

def decodeMessageHeader(hex):
    #first 8 bits, version
    i = 0
    if(hex[i:i + 2] != '01'):
        logerr("This is not a diameter message!")
        raise myException
    i += 2

    total  = []
    left   = []
    substr = []

    #next 24 bits, length
    length = eval('0x' + hex[i:i+6])
    if(length < 40 or len(hex) < 80):
        logerr("The length is %d, it too short to be diameter message" % length)
        raise myException
    headerinfo = "length = %d.\n" % length

    i += 6

    #next 8 bits, flags
    ori  = eval('0x' + hex[i:i+2])
    flag = []
    mask = 0x80
    while(mask != 0): 
        if(ori & mask): #bitwise compare
            flag.append(1)
        else:
            flag.append(0)
        mask //= 2
    headerinfo += "flag = %d,%d,%d,%d,%d,%d,%d,%d.\n"%(flag[0], flag[1], flag[2], flag[3],
                                                       flag[4], flag[5], flag[6], flag[7])
    i += 2

    #next 24 bits, commmand code
    command_code =  eval('0x' + hex[i:i+6])
    headerinfo +=("command_code = %d.\n" %command_code)
    i = i + 6

    #next 96 bits are application ID, hop-by-hop ID and end-to-end ID
    application_ID = eval('0x' + hex[i   :i+ 8])
    hop_by_hop_ID  = eval('0x' + hex[i+ 8:i+16])
    end_to_end_ID  = eval('0x' + hex[i+16:i+24])
    headerinfo += ("application ID = %d.\n" % application_ID)
    headerinfo += ("hop-by-hop ID  = %d.\n" % hop_by_hop_ID)
    headerinfo += ("end-to-end ID  = %d.\n" % end_to_end_ID)
    i += 24
    return i, length, headerinfo

datatype = {
"-1":"Unkown AVP",
"0" :"Grouped",
"1" :"OctetString",
"2" :"UTF8String",
"3" :"Integer32",
"4" :"Integer64",
"5" :"Unsigned32",
"6" :"Unsigned64",
"9" :"Address",
"10":"Time",
"11":"DiameterIdentity",
"12":"DiameterURI",
"13":"Enumerated",
"20":"Address2" #SFR special AVP
}

def genereateAvpDefineToFile(avps):
    f = open('avpdefine.ini','w')
    for a in avps:
        f.write("%s %s %s %s OC\n" % (avps[a][1],a.split(':')[0],a.split(':')[1],datatype[avps[a][0]]))
    f.close()
    return
    

def correctAvpDefine(avps):
    #incorrect AVPs
    avps["8:0"]     = ['9',"Framed-IP-Address"]
    avps["2:10415"] = ['1',"3GPP-Charging-Id"]
    #CER-CEA AVPs
    avps["257:0"] = ['9',"Host-IP-Address"]
    avps["269:0"] = ['2',"Product-Name"]
    avps["265:0"] = ['5',"Supported-Vendor-Id"]
    avps["259:0"] = ['5',"Acct-Application-Id"]
    avps["267:0"] = ['5',"Firmware-Revision"]
    avps["260:0"] = ['0',"Vendor-Specific-Application-Id"]
    avps["299:0"] = ['5',"Inband-Security-Id"]
    
    #SFR spcial adress type AVPs
    avps["8:0"][0] = '20'
    avps["7:10415"][0] = '20'
    avps["6:10415"][0] = '20'
    avps["16:10415"][0] = '20'
    avps["14:10415"][0] = '20'
    avps["1228:10415"][0] = '20'
    avps["4:10415"][0] = '20'
    avps["15:10415"][0] = '20'
    avps["1227:10415"][0] = '20'
    avps["846:10415"][0] = '20'
    avps["847:10415"][0] = '20'


def translate(type,msg):
    if  (type == "3" or type == "4" or type == "5" or type == "6" or type == "13"):
        return str(eval('0x'+msg))
    elif(type == "2" or type == "11"or type == "12"):
        s   = ""
        tmp = 0
        while(tmp < len(msg)):
            s += chr(eval('0x' + msg[tmp:tmp+2]))
            tmp += 2
        return s
    elif(type == "9" or type == "20"):
        return intToIP(eval('0x'+msg))
    elif(type == "10"):
        cur = time.gmtime(eval('0x'+msg) - 2208988800) # translate time from 1900-01-01 to 1970-01-01
        #return time.strftime("%a, %d %b %Y %H:%M:%S +0000", cur)
        return time.strftime("%Y%m%d%H%M%S", cur)
    return msg

def decodeAVPs(i, length, hex, avps):
    offset = [length * 2 - i]
    tree = []
    avp = AVP()
    while(i < len(hex)):
        #offset
        avp.offset = len(offset)

        #avp code
        avp.code = eval('0x' + hex[i:i+8])

        #avp flag
        mask = 0x80
        ori  = eval('0x' + hex[i+8:i+10])
        while(mask != 0):
            if(ori & mask): #bitwise compare
                avp.flag.append(1)
            else:
                avp.flag.append(0)
            mask //= 2

        #avp length
        avp.length = eval('0x' + hex[i+10:i+16])

        #VendorID
        if(avp.flag[0] == 1):
            avp.venderid = eval('0x' + hex[i+16:i+24])

        #Get the avp type
        avp_info = ['-1','Unknow AVP']
        if(str(avp.code) + ':' + str(avp.venderid) in avps):
            avp_info = avps[str(avp.code) + ':' + str(avp.venderid)]
        elif(avp.venderid != 0 and str(avp.code) + ':0' in avps):
            avp_info = avps[str(avp.code) + ':0']

        avp.datatype = avp_info[0]
        avp.name     = avp_info[1]

        #reset the pointor
        tmplen = 0
        tmplen = avp.length * 2
        if (tmplen % 8 != 0):
            tmplen = tmplen // 8 * 8 + 8
        if(avp.datatype != '0'):
            avp.value = translate(avp_info[0], hex[i + 16 + avp.flag[0] * 8: i + avp.length * 2])
        else:
            offset.append(tmplen)
            tmplen = 16 + avp.flag[0] * 8

        i += tmplen

        tmp = 0
        while(tmp < len(offset)):
            offset[tmp] -= tmplen
            tmp += 1
        while(len(offset) != 0 and offset[len(offset) - 1] <= 0):
            offset.pop()


        tree.append(avp);
        avp = AVP();

    return tree

def decode(avps,hex):
    #decode the message header
    try:
        i, length, headerinfo = decodeMessageHeader(hex)
    except(myException):
        return

    #decode AVPs
    #totoal size should be able to be devided by 8(double byte)
    if (length % 8 != 0):
        length = length // 8 * 8 + 8
    try:
        tree = decodeAVPs(i, length, hex, avps)
    except myException:
        return

    return headerinfo,tree

def prepare():
    #use the the directory where the script located as current work dir
    try:
    	os.chdir(os.path.dirname(sys.argv[0]))
    except:
        pass

    #load the avp define file
    file_name_avp_define = "Avpdefine.avp"
    avps = loadAvpDefineFile(file_name_avp_define)
    correctAvpDefine(avps)
    #genereateAvpDefineToFile(avps)
    return avps
    #hex = ''
    #decode(avps,hex)

def correctHex(input_hex):
    i = 0
    hex = ""
    while(i < len(input_hex)):
        if((input_hex[i] >= '0' and input_hex[i] <= '9') or
        ((input_hex[i] >= 'a' and input_hex[i] <= 'f') ) or
        ((input_hex[i] >= 'A' and input_hex[i] <= 'F') )):
            hex += input_hex[i]
        i += 1
    return hex
    
class myWindow(tk.Frame):
    def __init__(self, master=None,width=100, height=100):
        tk.Frame.__init__(self, width = width, height = height)
        self.grid()
        self.createWidgets()
        self.avps = prepare()
        self.bind_all("<Escape>", self.onClickEscape)

    def createWidgets(self):
        self.text_in = tk.Text(self)
        self.text_in.insert('1.0',"010002b8c000011000000004064002c4ca6402c40000010740000024726f7574696e67353b313337323434323739373b3637313734363334000001024000000c000000040000010840000010726f7574696e6735000001284000001b726f7574696e67352e6875617765692e636f6d000000011b400000196362703130312e6875617765692e636f6d000000000001cd4000001669636433406e6f6b69612e636f6d0000000001a04000000c000000010000019f4000000c00000000000001164000000c00000081000000374000000cd5784f0d000001bb4000002c000001c24000000c00000000000001bc4000001533333630393239333238383032000000000001bb4000002c000001c24000000c00000001000001bc4000001732303831303138383139303430373100000001c74000000c00000001000000084000000c0a2400510000001e400000147761707366722e76616c69640000010bc0000014000031650102f8014a3847ab00000017c000000e000028af80fd000000000007c0000010000028afc37345a700000002c0000010000028af0903b4010000000dc0000010000028af3034303000000003c0000010000028af0000000000000004c0000010000028af0a32326e00000008c0000011000028af323038313000000000000012c0000011000028af323038313000000000000009c0000011000028af323038313000000000000005c0000025000028af39392d3133393331463733393638454231373438324646464600000000000001c000001b000028af323038313031383831393034303731000000000ac000000d000028af350000000000000cc000000d000028af3000000000000106c000002b00003165776562736672636f6c642077656273667220707265706169647765627366720000000006c0000010000028af0a403d0100000104c00000100000316500000001")
        #self.text_in.insert('1.0','Put the HEX string here')
        
        self.text_out = tk.Text(self, wrap=tk.NONE)
        self.text_out.insert('1.0','AVP tree will show here')
        self.scr = tk.Scrollbar(self)
        self.text_out.config(yscrollcommand=self.scr.set)
        self.scr.config(command=self.text_out.yview)

        self.button_decode = tk.Button(self, text = 'Decode', command=self.onClickDecode)
        self.flag = tk.IntVar()
        self.radio0 = tk.Radiobutton(self,text = 'Normal', variable = self.flag, value = 0)
        self.radio1 = tk.Radiobutton(self,text = 'ITest ', variable = self.flag, value = 1)

        self.text_in.grid (row = 0, column = 0, rowspan = 3, sticky=tk.N+tk.S+tk.E+tk.W)
        self.text_out.grid(row = 0, column = 2, rowspan = 3, sticky=tk.N+tk.S+tk.E+tk.W)
        
        self.button_decode.grid(row = 0, column = 1, sticky = tk.S + tk.E + tk.W)
        self.radio0.grid(row = 1, column = 1, sticky = tk.N + tk.E + tk.W)
        self.radio1.grid(row = 2, column = 1, sticky = tk.N +tk.E + tk.W)

        #for the button widget and radio button widgets
        self.rowconfigure(0,weight = 1)
        #self.rowconfigure(1,weight = 1)
        self.rowconfigure(2,weight = 1)
        
        #for the text widgets
        self.columnconfigure(0,weight = 10)
        #self.columnconfigure(1,weight = 2)
        self.columnconfigure(2,weight = 1)

    def onClickEscape(self, key):
        self.master.quit()

    def setOutputText(self, headerinfo, tree):
        #set output texts
        self.text_out.delete('1.0','end')
        self.text_out.insert(tk.CURRENT, headerinfo + '\n')

        i = 0
        while (i <= len(tree)):
            #get the flag from the RadioBox widget
            #Normal Style
            if (self.flag.get() == 0):  
                if(i < len(tree)):
                    self.text_out.insert(tk.CURRENT, tree[i].output() + '\n')
                    
            #ITest Style
            else:      
                s = ""
                # the first AVP
                if(i == 0):
                    s += '['
                    if(tree[i].datatype == '0'):
                        if(tree[i+1].offset == tree[i].offset):
                            s += '{"%d": []},\n' % tree[i].code
                        else:
                            s += '{"%d": [\n' % tree[i].code
                    else:
                        s += '{"%d": "%s"}' % (tree[i].code, tree[i].value)
                        if (tree[i].offset == tree[i + 1].offset):
                            s += ','
                        s += '\n'
                        #s += '\t\t\t#%s(%d,%d)\n' % (tree[i].name, tree[i].code, tree[i].venderid)
                        
                #After the last AVP, we need to add some additional ']' and '}'
                elif( i == len(tree)):
                    if(tree[i-1].offset > 1):
                        k = tree[i-1].offset - 1
                        j = 0
                        while (j < k):
                            tmp = tree[i - 1].offset - j - 1
                            while(tmp > 1):
                                s += '\t'
                                tmp -= 1
                            if(j < k - 1):
                                s += ']},'
                            s += ']}\n'
                            j += 1
                    s += ']'
                # AVPs other then the first one
                else:
                    if(tree[i-1].offset > tree[i].offset):
                        k = tree[i-1].offset - tree[i].offset
                        j = 0
                        while (j < k):
                            tmp = tree[i - 1].offset - j - 1
                            while(tmp > 1):
                                s += '\t'
                                tmp -= 1
                            s += ']},\n'
                            j += 1

                    tmp = tree[i].offset
                    while(tmp > 1):
                        s += '\t'
                        tmp -= 1

                    #for the last AVP(not after the last one, this is THE last one), need add do tell additional info
                    if(i < len(tree) - 1):
                        next_offset = tree[i+1].offset
                    else:
                        next_offset = 1
                     
                    #For Grouped AVP
                    if(tree[i].datatype == '0'):
                        #Grouped AVP without any leaf
                        if(next_offset == tree[i].offset):
                            s += '{"%d:%d": []},' % (tree[i].code, tree[i].venderid)
                        else:
                            s += '{"%d:%d": [' % (tree[i].code, tree[i].venderid)
                        #s += '\t\t\t#%s(%d,%d)\n' % (tree[i].name, tree[i].code, tree[i].venderid)
                        s += '\n'
                    #For normal AVP
                    else:
                        type = tree[i].datatype 
                        if(type == "3" or type == "4" or type == "5" or type == "6" or type == "13"):
                            s += '{"%d:%s": %s}' % (tree[i].code, tree[i].venderid, tree[i].value)
                        else:
                            s += '{"%d:%s": "%s"}' % (tree[i].code, tree[i].venderid, tree[i].value)
                        if(i < len(tree) -1 and tree[i].offset == next_offset):
                            s += ','
                        #s += '\t\t\t#%s(%d,%d)\n' % (tree[i].name, tree[i].code, tree[i].venderid)
                        s += '\n'

                self.text_out.insert(tk.CURRENT, s)

            i += 1
        
    def onClickDecode(self):
        input_hex = self.text_in.get('1.0','end')
        hex = correctHex(input_hex)
        loginfo(hex)
        headerinfo, tree = decode(self.avps,hex)
        self.setOutputText(headerinfo, tree)

class decode_diameter():
    def __init__(self):
        self.avps = prepare()
        
    def decode(self, input_hex):
        hex = correctHex(input_hex)
        #loginfo(hex)
        headerinfo, tree = decode(self.avps,hex)
        return headerinfo, tree
   
def main():
    root = tk.Tk()
    root.geometry('1024x600')
    win = myWindow(root)

    #set the gird info
    root.rowconfigure(0,weight = 1,minsize = 300)
    root.columnconfigure(0, weight = 1,minsize = 300)
    win.grid(row=0,column=0,sticky=tk.N+tk.S+tk.E+tk.W)

    root.title("DiameterDecoder")
    root.mainloop()


if __name__ == '__main__':
    main()
