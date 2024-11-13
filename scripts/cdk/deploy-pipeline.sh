#!/bin/bash

set -eo pipefail
[[ ! -z ${TRACE_ENABLED} ]] && set -x
source ./scripts/initialise.sh

if [[ ! -z $1 ]]; then
  branch=$1
else 
  branch=main
fi

component=app
/bin/bash ${scriptDir}/set-config.sh --branch $branch --component $component
prefix=$(jq -r '.prefix.name' ${configFile})
stage=$(jq -r '.stage' ${configFile})
cdk deploy $prefix-$stage-$component-cdk-pipeline-stack --require-approval never &
wait -f

set +x
