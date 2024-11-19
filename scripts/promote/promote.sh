#!/bin/bash

set -eo pipefail
[[ ! -z ${TRACE_ENABLED} ]] && set -x
#source ../../scripts/initialise.sh

echo PROMOTING

#/bin/bash promote-api.sh

set +x
