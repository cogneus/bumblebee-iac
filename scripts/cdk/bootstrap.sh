#!/bin/bash

set -eo pipefail
[[ ! -z ${TRACE_ENABLED} ]] && set -x
source ./scripts/initialise.sh


function bootstrapRegion {
  region=$1
  /bin/bash ${scriptDir}/set-config.sh --region $region
  account=$(jq -r '.awsAccountId' ${configFile})
  bucketName=$(jq -r '.s3.cdkBucket' ${configFile})
  qualifier=$(jq -r '.prefix.qual' ${configFile})
  prefix=$(jq -r '.prefix.name' ${configFile})
  permissionBoundaryName=$(jq -r '.iam.permissionsBoundaryName' ${configFile})
  echo $permissionBoundaryName
  tags=$(jq -r '.tags' ${configFile} | jq -r 'to_entries|map("\(.key)=\(.value|tostring)")|join(" --tags ")')
  cdk bootstrap aws://${account}/${region} \
    --toolkit-stack-name $prefix-cdk-stack \
    --bootstrap-customer-key \
    --bootstrap-bucket-name $bucketName \
    --custom-permissions-boundary $permissionBoundaryName \
    --qualifier $qualifier \
    --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess \
    --tags $tags & #\
     #--termination-protection

  wait -f
}

for region in $(jq -r '.regions[]' ${coreConfigFile}); do
  bootstrapRegion $region
done

set +x
