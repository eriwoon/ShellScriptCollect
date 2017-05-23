#! /bin/sh

#######################################################
#define variables
#######################################################
#the file prefix
fileprefix='infra2slb.cap'
source_dir='/cygdrive/d/BYT/temp'

#conpressed file information
dest_dir='/cygdrive/d/BYT/temp/dest'
dest_dir_max_size=200  #(KB) 10 GB

#log file
log_file_name=AutoCleanUp.log
log_file_max_size=200 #KB 10MB

#lock file name
lock_file_name='.AutoClean.lock'

function writelog()
{
    echo "$(date '+%Y%m%d %H%M%S') $1" >> $source_dir/$log_file_name  
}

#######################################################
#start and create log
#######################################################
if [ ! -d $source_dir ] ; then
    exit
fi

if [ ! -f $source_dir/$log_file_name ]; then
    touch $source_dir/$log_file_name
elif [ $(du -sk $source_dir/$log_file_name | cut -f1) -gt $log_file_max_size ]; then
    mv $source_dir/$log_file_name $source_dir/$log_file_name.old
    writelog "INF mv $source_dir/$log_file_name $source_dir/$log_file_name.old."
fi

writelog "INF start process."

if [ ! -d $dest_dir ]; then
    writelog "INF Create dir:$dest_dir."
    mkdir -p $dest_dir
fi

#create log
if [ -f $source_dir/$lock_file_name ]; then
    writelog "ERR $lock_file_name exist, will not run."
    exit
else
    writelog "Add lock $lock_file_name."
    touch $source_dir/$lock_file_name
fi

#######################################################
#Compress Files
#######################################################
#get all the uncompressed files
files=$(ls -rt1 ${source_dir}/${fileprefix}* | grep -v 'gz')

#get the number, then minus 2(keep the last 2 files)
number=$(expr  $(ls -rt1 ${source_dir}/${fileprefix}* | grep -v 'gz' | wc -l) - 2)

#Compress them one by one
i=1
for file in $files
do
    #only 2 files left? if yes, break
    if [ $i -gt $number ] ; then
        break
    else
        i=$(expr $i + 1)
    fi

    #get the latest time when the file is modified
    endtime=$(date -d @$(stat -c '%Y' $file | cut -b 1-19) +%Y%m%d%H%M%S)
    dest_file_name=${dest_dir}/${endtime}_$(basename ${file}).gz
    
    gzip -c $file > $dest_file_name
    rm $file
    writelog "INF compress: $file > $dest_file_name"
done

#######################################################
#delete files if there are the size of files is too big
#######################################################
#dest dir

while [ $(du -sk $dest_dir | cut -f1) -gt $dest_dir_max_size ]
do
    file=$(ls -1 ${dest_dir}/*_${fileprefix}*.gz | head -1)
    if [ -f $file ]; then
        rm $file
        writelog "INF delete file: $file."
    else
        exit
    fi
done

#log files


#######################################################
#remove lock and end
#######################################################
rm -f $source_dir/$lock_file_name
writelog "INF lock removed."
writelog "INF process finished."
