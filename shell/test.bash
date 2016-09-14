#!/bin/bash

function transportBackup() {
  today=$(date +"%Y-%m-%d")
  weekelr=$(date -d "-7 days" +"%Y-%m-%d")
  echo $today
  echo weekelr$weekelr
  for ep in $(ls -R $1)
  do
    if [ "${ep: -7}" == ".sql.gz" ]; then
      echo gz: $ep
      dateOfBK=`echo $ep | cut -c 6-15`
      echo dateOfBK:$dateOfBK
      if [ $dateOfBK == $today ]; then
        echo today: $ep
        # scp $ep cf-test@139.196.193.120:~/backup
        #statements
      elif [ $dateOfBK \< $weekelr ]; then
        echo rm:$ep
        # rm $ep
        #statements
      fi
    fi
  done
}

transportBackup ~/backup
