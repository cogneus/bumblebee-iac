#!/bin/bash
set -eo pipefail
[[ ! -z ${TRACE_ENABLED} ]] && set -x
source ../initialise.sh

endPoint=$2
source ${dir}/create-postman-env.sh ${region} ${endPoint}
echo "Running postman tests for ${region} ${endpoint} ${serviceUrl}"
newman run ${dir}/api-postman-col.json -e ${envFile} --folder Access --bail --color off --verbose
newman run ${dir}/api-postman-col.json -e ${envFile} --folder Templates --bail --color off --verbose
echo "Completed postman tests for ${region} ${endpoint} ${serviceUrl}"
set +x
