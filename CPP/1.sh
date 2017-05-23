#! /bin/sh
echo -n > numbers.txt2
while read i
do
    expr $i + 100000000 >> numbers.txt2
done < numbers.txt
