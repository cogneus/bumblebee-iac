#!/bin/bash

set -eo pipefail
[[ ! -z ${TRACE_ENABLED} ]] && set -x
source ./scripts/initialise.sh

if [[ ! -z $1 ]]; then
  branch=$1
else 
  branch=main
fi

function deployRegion {
  region=$1
  /bin/bash ${scriptDir}/set-config.sh --region $region --branch $branch --component app
  prefix=$(jq -r '.prefix.name' ${configFile})
  cdk deploy $prefix-cdk-stack &
  wait -f
}

for region in $(jq -r '.regions[]' ${coreConfigFile}); do
  deployRegion $region
done

set +x
