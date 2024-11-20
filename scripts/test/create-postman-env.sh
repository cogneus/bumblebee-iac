#!/bin/bash
set -eo pipefail
[[ ! -z ${TRACE_ENABLED} ]] && set -x
source ../scripts/initialise.sh

region=$1

if [[ -z ${2} ]]; then
  endPoint=next
else
  endPoint=$2
fi

/bin/bash ${scriptDir}/set-config.sh --component app --region $region

currentStage=$(/bin/bash ${scriptDir}/deploy/get-stage.sh)
nextStage=$(/bin/bash ${scriptDir}/deploy/get-stage.sh --next)
ssmPrefix=$(jq -r '.prefix.ssm' ${configFile})  
productName=$(jq -r '.productName' ${configFile})  
componentName=$(jq -r '.componentName' ${configFile})  
environmentName=$(jq -r '.environmentName' ${configFile})  
regionCode=$(jq -r '.regionCodes["'${region}'"]' ${configFile})
hostedZone=$(jq -r '.route53HostedZone' ${configFile})
baseDomain="${environmentName}.${productName}.${hostedZone}"
origin=$(jq -r '.allowedOrigins[0]' ${configFile}) 

secretNamePrefix=$(jq -r ".prefix.name" ${configFile})
tokensName=$(jq -r ".secrets.tokens.name" ${configFile})

if [ "${endPoint}" == "live" ]; then
  domainPath=$baseDomain/templates
elif [ "${endPoint}" == "blue" ]; then
  domainPath="blue.${baseDomain}/templates"     
elif [ "${endPoint}" == "green" ]; then
  domainPath="green.${baseDomain}/templates"       
elif [ "${endPoint}" == "region" ]; then
  domainPath="${regionCode}.${baseDomain}/templates"
elif [ "${endPoint}" == "local" ]; then
  domainPath="localhost:8080"
else   
  if [ "${endPoint}" == "current" ]; then
    stage=$currentStage
  else
    stage=$nextStage
  fi
  domainPath="$(aws --region ${region} ssm get-parameter --name "${ssmPrefix}/${stage}/${componentName}/api/domain" | jq -r '.Parameter.Value')"
fi

serviceUrl=//${domainPath}/v1/staging
tokens=$(aws --region ${region} secretsmanager get-secret-value --secret-id "${secretNamePrefix}-${tokensName}" | jq -r '.SecretString')
readUserToken=$(jq -r '.["read-user"]' <<< $tokens)
writeUserToken=$(jq -r '.["write-user"]' <<< $tokens)
deniedUserToken=$(jq -r '.["denied-user"]' <<< $tokens)

echo "Creating postman environment for ${region} ${endPoint} ${serviceUrl}"
export region=$region
export serviceUrl=$serviceUrl
export envFile="${dir}/api-postman.${region}-${endPoint}.env.json"

cat ${dir}/api-postman-env.json |
  sed -e "s#<SERVICE_URL>#${serviceUrl}#;" |
  sed -e "s#<READ_USER_TOKEN>#${readUserToken}#;" |
  sed -e "s#<WRITE_USER_TOKEN>#${writeUserToken}#;" |
  sed -e "s#<DENIED_USER_TOKEN>#${deniedUserToken}#;" |
  sed -e "s#<ORIGIN>#${origin}#;" >${envFile}

set +x
