#! /bin/sh
rm -f *infra2slb.cap*
rm -fr dest
rm -f AutoCleanUp.log
rm -f AutoCleanUp.log.old
cp source AutoCleanUp.log
i=10
while [ $i -lt 24 ]
do
    echo -en "\r$i"
    cp source infra2slb.cap$i
    touch -d "2014-04-20 $i:00:00" infra2slb.cap$i
    i=$(expr $i + 1)
done
echo " done."
echo


if [ -f .AutoClean.lock ]; then
    rm .AutoClean.lock
    echo .AutoClean.lock deleted.
    echo
fi

echo run ./AutoCleanUp.sh
./AutoCleanUp.sh
echo 
tail -30 AutoCleanUp.log