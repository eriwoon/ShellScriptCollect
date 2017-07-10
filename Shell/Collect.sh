#一个用来查看run目录下有没有6个日志都是今天的
#! /bin/sh

i=100
echo > 1.unl

while [ $i -lt 1000 ]
do

        n=`ls -1 *c${i}_* 2> /dev/null | wc -l  2> /dev/null`
        if [ $n -eq 5 ]; then
                if [ `ls -1h *c${i}_* | head -n 1 | cut -d_ -f3 | cut -b1-8` = '20140226' ]; then
                        ls -1 *c${i}.*
                fi
        fi

        i=`expr $i + 1 `
done

########################################################################################

#写了一个脚本，实现自动发送WebService消息的能力
#! /bin/sh
tmp=$1
i=0
while [ 1 ]
do
    i=`expr $i + 1`
    time=`date +%s`
    sed "s/xiaozhen1/$tmp$time$i/g" 1.xml > $tmp.tmp

    curl -d @$tmp.tmp \
    -H "SOAPAction: \"ChangeSubscriberIntegratedInfor\"" \
    -H "Accept-Encoding: gzip,deflate" \
    -H "Content-Type: text/xml;charset=UTF-8" \
    -H "User-Agent: Apache-HttpClient/4.1.1 (java 1.5)" \
    -H "Connection: Keep-Alive" \
    "http://10.88.150.9:7782//services/CBSInterfaceBusinessMgrService" \
    > /dev/null
done

########################################################################################

#自动远程登录主机的关键部分
for ip in $IP
do
        echo %ip
        expect -c "
                spawn ssh -o StrictHostKeyChecking=no ${username}@$ip \"${command}\"
                expect *assword:*;
                send -- $password\r;
                interact;"
done

#从stdin读数据的脚本
#! /bin/sh

i=1

while read line
do
        #WebLog
        if [ "x`echo $line | grep weblog`" != "x" ]; then
                echo $line | cut -d'|' -f1 | cut -d':' -f2 | xargs echo -n

        #mon
        elif [ "x`echo $line | grep omon`" != "x" ]; then
                echo $line | cut -d'|' -f2 | xargs echo -n

        #mgr
        elif [ "x`echo $line | grep omgr`" != "x" ]; then
                echo $line | cut -d'|' -f3 | xargs echo -n

        #data
        elif [ "x`echo $line | grep odata`" != "x" ]; then
                echo $line | cut -d'|' -f3 | xargs echo -n

        #SMSSend
        elif [ "x`echo $line | grep cbpsmssend`" != "x" ]; then
                echo $line | cut -d'|' -f1 | cut -d':' -f2 | xargs echo -n

        #expireddata
        elif [ "x`echo $line | grep expireddata`" != "x" ]; then
                echo $line | cut -d'|' -f1 | cut -d':' -f2 | xargs echo -n

        fi
        echo ':'$line

done < 1.txt

##################################################################################
#关于时间格式修改的脚本
#!/bin/sh

CONF_FILE="./xz_vsr_getinfo.cfg"

for pair in `cat $CONF_FILE | grep '^[^#].*'`
do
    #echo $pair
    pair_name=`echo "$pair" | awk -F"=" '{print $1}'`
    pair_value=`echo "$pair" | awk -F"=" '{print $2}'`
    if [ "x$pair_name" != "x" -a  "x$pair_value" != "x" ]; then
        eval $pair_name=$pair_value
    fi
done

#Get the time information
if [ "x$1" == "x" ] ; then
    tm_date=`date -d $tm_date +%Y%m%d`
else
    tm_date=`date -d $1 +%Y%m%d`
fi
#tm_tomorrow=`date -d "$tm_date 1 days" +%Y%m%d`

##initialise variables
out_filename="ocs_info_${tm_date}.csv"
lis_offerid=`echo $lis_offerid | sed 's/,/ /g'`

echo -n "datetime${delimiter}Customer${delimiter}subscriber${delimiter}FUPuser" > $out_filename
if [ "x$lis_offerid" != "x" ]; then
    for offerid in $lis_offerid
    do 
        echo -n "${delimiter}$offerid" >> $out_filename
    done
fi
echo "">> $out_filename

#get the second
#tm_date_sec=`date -d $tm_date +%s`
#tm_tomorrow_sec=`date -d $tm_tomorrow +%s`
#tm_tomorrow_sec=`expr $tm_tomorrow_sec - 1 `

#tm_cur=`expr $tm_date_sec - 1`

#while [ $tm_cur -lt $tm_tomorrow_sec ]
#do
    tm_begin=${tm_date}235959
    #tm_cur=`expr $tm_cur + 3600` 
    #tm_begin=`date -d @$tm_cur +%Y%m%d%H%M%S`
    #echo -n "$tm_begin  "; date
    echo -n $tm_begin >> $out_filename
    
    #A
    re_sql=`mdsql -c "select count(*) from A where STARTTIME < '$tm_begin' and ENDTIME > '$tm_begin';" | head -3 | tail -1 | awk '{print $1}'`
    echo -n "${delimiter}$re_sql" >> $out_filename
    
    #B
    re_sql=`mdsql -c "select count(*) from B where STARTTIME < '$tm_begin' and ENDTIME > '$tm_begin';" | head -3 | tail -1 | awk '{print $1}'`
    echo -n "${delimiter}$re_sql"  >> $out_filename

    re_sql=`mdsql -c "select count(*) from C where (STATUS = '24' or STATUS = '25' or STATUS = '26') and STARTTIME < '$tm_begin' and ENDTIME > '$tm_begin';" | head -3 | tail -1 | awk '{print $1}'`
    echo -n "${delimiter}$re_sql" >> $out_filename
    
    if [ "x$lis_offerid" != "x" ]; then
        for offerid in $lis_offerid
        do 
            re_sql=`mdsql -c "select count(*) from D where PRODUCTOFFERKEY = $offerid and STARTTIME < '$tm_begin' and ENDTIME > '$tm_begin';" | head -3 | tail -1 | awk '{print $1}'`
            echo -n "${delimiter}$re_sql" >> $out_filename
        done
    fi
    
    echo "" >> $out_filename
    
#done
#cat $out_filename


########################################
