#!/bin/bash
declare -A IMGC

docker image ls | tr -s ' ' |  while read -r img; do
  #echo "image is: $img"
  repo=$(echo $img | cut -d' ' -f1)
  id=$(echo $img | cut -d' ' -f3)
  #echo "repo: $repo"
  #IMGC["$repo"]=1
  #echo "${IMGC[$repo]}"
  if [[ -z ${IMGC[$repo]} ]]; then
    IMGC[$repo]=0
  elif [[ ${IMGC[$repo]} > 1 ]]; then
    docker image rm $id -f
    echo "delete: $img"
  else
    IMGC[$repo]=$(expr ${IMGC[$repo]} + 1)
  fi
done

docker system prune -f
