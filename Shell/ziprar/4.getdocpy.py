#! /usr/bin/python3

import sys

file = sys.argv[1]

with open(file) as fread:
    content = fread.read()
    url = ("http" + content.split("http")[1]).split("\\par")[0].split(" ")[0]
    if(url.find("\\") != -1):
        print("")
    else:
        print(url)


