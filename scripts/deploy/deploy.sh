#!/bin/bash
set -eo pipefail
[[ ! -z ${TRACE_ENABLED} ]] && set -x
source ../../scripts/initialise.sh
 
# Deploys the pipeline for managing application platform resources
cd "${resourcesDir}/pipeline" && /bin/bash deploy.sh $1

set +x