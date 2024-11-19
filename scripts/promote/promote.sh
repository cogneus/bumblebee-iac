#!/bin/bash

set -eo pipefail
[[ ! -z ${TRACE_ENABLED} ]] && set -x
source ../initialise.sh

/bin/bash promote-api.sh

set +x
