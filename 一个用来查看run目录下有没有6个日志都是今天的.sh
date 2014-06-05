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
