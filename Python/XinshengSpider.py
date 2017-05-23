#! /usr/bin/python
#coding: utf-8

import os
import urllib2
import urllib
import cookielib
import re

# Remove all the proxy settings
#proxy_handler = urllib2.ProxyHandler({'http': 'http://www.example.com:3128/'})
#proxy_auth_handler = urllib2.ProxyBasicAuthHandler()
#proxy_auth_handler.add_password('realm', 'host', 'username', 'password')
#opener = urllib2.build_opener(proxy_handler, proxy_auth_handler)
opener = urllib2.build_opener(urllib2.ProxyHandler({}))
# install cookie

opener.add_handler(urllib2.HTTPCookieProcessor(cookielib.CookieJar()))

testURL = "http://xinsheng.huawei.com"
# Login Page
#authURL = "https://login.huawei.com/login/?authPolicy=10&errCode=adAuthFail&lang=en&wds=0&redirect=http%3A%2F%2Fxinsheng.huawei.com%2Fcn%2Findex"
authURL = "https://uniportal.huawei.com/uniportal/?redirect=http%3A%2F%2Fxinsheng.huawei.com%2Fcn%2Findex"
# Xinsheng URL
#destURL = "xinsheng.huawei.com/cn/index.php?app=forum&mod=List&act=index&class=409&cate=2"
destURL = "http://xinsheng.huawei.com/cn/index.php?app=forum&mod=List&act=index&class=409&cate=2"

headers = {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.110 Safari/537.36'}

#** Login to URL,retrieve the cookie **
req = urllib2.Request(url = authURL,
                      headers = headers)

response = opener.open(req)
print str(response.getcode()) + ":" + response.geturl()

#** send the User name and password by http push **
data = {"actionFlag":"loginAuthenticate",
        "lang":"en",
        "loginMethod":"login",
        "loginPageType":"mix",
        "redirect":destURL,
        "redirect_local":"",
        "redirect_modify":"",
        "scanedFinPrint":"",
        "uid": os.environ["USERNAME"],
        "password":os.environ["PASSWORD"],
        "verifyCode":"2345"}

req2 = urllib2.Request(#url="https://login.huawei.com/login/login.do",
                       url="https://uniportal.huawei.com/uniportal/login.do",
                       data = urllib.urlencode(data),
                       headers = headers)

response = opener.open(req2)
print str(response.getcode()) + ":" + response.geturl()

#** get xinsheng list **
#req3 = urllib2.Request(url = "http://xinsheng.huawei.com/cn/index.php?app=forum&mod=List&act=index&class=409&cate=2",
#                       headers = headers)

#response = opener.open(req3)

#html = response.read()

#print type(html)
#for iter in re.findall(r'<font >.*进行中.*title="(.*)" target.*</font>', html):
#    print iter

list = []

for i in range(10):
    req = urllib2.Request(url = "http://xinsheng.huawei.com/cn/index.php?app=forum&mod=List&act=index&class=409&cate=2&p=%d" % (i + 1),
                          headers = headers)
    response = opener.open(req)
    html = response.read()

    list += re.findall(r'<font >.*进行中.*title="(.*)" target.*</font>', html)

for i in range(len(list)):
    print str(i) + ":" + list[i]

