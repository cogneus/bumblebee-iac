#!/bin/bash
set -eo pipefail
[[ ! -z ${TRACE_ENABLED} ]] && set -x
source ../initialise.sh

if [[ -z ${folder} ]]; then
  folder=$1
fi

endPoint=$2
source ${dir}/create-postman-env.sh ${region} ${endPoint}
echo "Running postman tests for ${region} ${endpoint} ${serviceUrl}"
newman run ${dir}/api-postman-col.json -e ${envFile} --folder $folder --bail --color off --verbose
echo "Completed postman tests for ${region} ${endpoint} ${serviceUrl}"
set +x
