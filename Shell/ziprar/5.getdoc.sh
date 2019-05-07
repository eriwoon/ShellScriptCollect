#! /bin/sh

files=`ls doclist/*.doc`
for file in $files
do
    url=`../ziprar/4.getdocpy.py $file`
    echo $file,$url
done
