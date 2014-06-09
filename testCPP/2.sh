#! /bin/sh
rand -u -M 999999999 -N 20 | sed 's/ /\n/g' > prefixList.txt

