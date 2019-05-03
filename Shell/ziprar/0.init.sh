#! /bin/bash
curtime=`date +%Y%m%d%H%M%S`
tmp_dir="/storage/emulated/0/1/$curtime"
src_dir="/storage/emulated/0/Tencent/WeixinWork/filecache/1688852792010670/"

files=`find $src_dir -name "*.*"`
echo $src_dir

if [ "$files" ]; then
    count=1
    mkdir -p $tmp_dir
    for file in $files
    do
        if [ ${file:0-4:4} = ".rar" ]; then
            mv $file ${tmp_dir}/${count}.rar
        elif [ ${file:0-4:4} = ".zip" ]; then
            mv $file ${tmp_dir}/${count}.zip
        fi
        count=`expr $count + 1`

    done
    echo [INFO] file moved.
else
    echo [ERROR] No file is found.
    return
fi
