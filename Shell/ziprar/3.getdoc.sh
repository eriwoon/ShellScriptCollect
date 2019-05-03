#! /bin/sh

files=`ls doclist/*.doc`
for file in $files
do
    url=`sed "s/\\\\par/\n/g" $file | sed "s/ /\n/g" | grep http`
    echo $file,$url
done
