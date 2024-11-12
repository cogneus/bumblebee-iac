#!/bin/bash

set -eo pipefail
[[ ! -z ${TRACE_ENABLED} ]] && set -x
option=$1
path=$(jq -r ".ssm.activeStage" ${configFile})
componentName=$(jq -r ".componentName" ${configFile})
response=$(aws --region ${defaultRegion} ssm get-parameters --names ${path}/${componentName})
currentStage=$(jq -r ".Parameters[0].Value" <<< ${response})

if [ "${option}" == "--next" ]; then
  if [ "${currentStage}" == "green" ]; then
    stageName="blue"
  else
    stageName="green"
  fi
else
  stageName=$currentStage
fi

if [[ "${stageName}" != "null" ]]; then
  stage=$(jq -r ".deployStages."${stageName} ${configFile})
else
  stage=""
fi

echo "${stage}"
set +x

