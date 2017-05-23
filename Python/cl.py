#! /usr/bin/python
#coding: utf-8

import urllib2
import re

opener = urllib2.build_opener(urllib2.ProxyHandler({}))
headers = {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.110 Safari/537.36'}
list = []

for i in range(2):
    req = urllib2.Request(url = "http://dz.zh4.co/thread0806.php?fid=2&search=&page=%d" % (i + 1),
      headers = headers)
    response = opener.open(req)
    html = response.read()
    #print re.findall(r'<h3><a href=.*target="_blank" id="">(.*)</a></h3>', html)
    print str(re.findall(r'<h3><a href=.*target="_blank" id="">(.*)</a></h3>', html))#.decode('gbk')


