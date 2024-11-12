#!/bin/bash

set -eo pipefail
[[ ! -z ${TRACE_ENABLED} ]] && set -x
stage=$1
path=$(jq -r ".ssm.activeStage" ${configFile})
componentName=$(jq -r ".componentName" ${configFile})
aws --region ${defaultRegion} ssm put-parameter --name ${path}/${componentName} --value ${stage} --type String --overwrite >/dev/null

set +x

