#! /bin/sh
curtime=`date +%Y%m%d%H%M%S`
tmp_dir="/storage/emulated/0/1/$curtime"
src_dir="/storage/emulated/0/Tencent/WeixinWork/filecache/1688852792010670/"

files=`find $src_dir -name "*.*"`
echo $src_dir

if [ "$files" ]; then
    count=1
    mkdir -p $tmp_dir
    mv $files $tmp_dir
    echo [INFO] file moved.
else
    echo [ERROR] No file is found.
    return
fi
