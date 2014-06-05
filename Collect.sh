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
