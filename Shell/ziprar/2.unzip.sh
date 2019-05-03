#! /bin/bash

dir="/storage/emulated/0/1/"

workdir=`ls -1t $dir | head -1`
fulldir=$dir$workdir

if [ ! "$workdir" ]; then
    echo [ERROR] No file is found.
    return
else
    echo [INFO] Work dir: $workdir, file No.: `ls -1 $fulldir | wc -l`.
fi

#unrar and unzip
cd $fulldir

for file in `ls *.rar`
do
    unrar e $file
done


