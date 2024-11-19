#!/bin/bash
#!/bin/bash

set -eo pipefail
[[ ! -z ${TRACE_ENABLED} ]] && set -x
source ../../scripts/initialise.sh

component=app
/bin/bash ${scriptDir}/set-config.sh --component $component
currentStage=$(/bin/bash ${scriptDir}/deploy/get-stage.sh)
nextStage=$(/bin/bash ${scriptDir}/deploy/get-stage.sh --next)

function promoteAPIMapping {
  region=$1
  domainName=$2
  apiId=$3
  
  mappingKey=$(jq -r '.apiMappings.'$component ${configFile})
  apiStage=prod

  echo "Promoting ${domainName}/${mappingKey}/${apiStage} for '${region}' '${nextStage}'"
  mappingExists=$(aws --region ${region} apigatewayv2 get-api-mappings --domain-name ${domainName} --output json | jq "[.Items[] | select(.ApiMappingKey == \"${mappingKey}\")] | length")
  
  if [ ${mappingExists} -eq 0 ]; then
    aws --region ${region} apigatewayv2 create-api-mapping --domain-name ${domainName} --api-id ${apiId} --api-mapping-key ${mappingKey} --stage ${apiStage} >/dev/null
  else
    apiMappingId=$(aws --region ${region} apigatewayv2 get-api-mappings --domain-name ${domainName} --output json | jq -r ".Items[] | select(.ApiMappingKey == \"${mappingKey}\") | .ApiMappingId")
    aws --region ${region} apigatewayv2 update-api-mapping --domain-name ${domainName} --api-id ${apiId} --api-mapping-key ${mappingKey} --api-mapping-id ${apiMappingId} --stage ${apiStage} >/dev/null
  fi
}

for region in $(jq -r '.regions[]' ${coreConfigFile}); do
  echo "Promoting api '${region}' '${nextStage}'"
  ssmPrefix=$(jq -r '.prefix.ssm' ${configFile})
  componentName=$(jq -r '.componentName' ${configFile})
  productRef=$(jq -r '.productRef' ${configFile})  
  environmentName=$(jq -r '.environmentName' ${configFile})  
  regionCode=$(jq -r '.regionCodes["'${region}'"]' ${configFile})  
  domain=$(jq -r '.route53HostedZone' ${configFile})
  apiId=$(aws --region ${region} ssm get-parameter --name ${ssmPrefix}/${nextStage}/${componentName}/cdk/api/id | jq -r '.Parameter.Value')

  export primaryDomain="${environmentName}.${productRef}.${domain}"
  export stageDomain="${nextStage}.${primaryDomain}"
  export regionDomain="${regionCode}.${primaryDomain}"

  promoteAPIMapping ${region} ${primaryDomain} ${apiId}
  promoteAPIMapping ${region} ${stageDomain} ${apiId}
  promoteAPIMapping ${region} ${regionDomain} ${apiId}
done

$(/bin/bash ${scriptDir}/deploy/set-stage.sh $nextStage)

set +x
