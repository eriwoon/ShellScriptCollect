#! /bin/bash
test=`ls`
echo $test
for file in ${test}
do
    echo $file
    echo ${file:0-3:3}
done

