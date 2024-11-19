if [[ $initialised != true ]] ; then
  if [[ ${environmentName} == "" ]] ; then
    read -p $'Enter the environment name you want to connect to\n' -r
    export environmentName=$REPLY
  fi
  export initialised=true
  export dir="$(pwd)"
  export rootDir="$(git rev-parse --show-toplevel)"
  if [[ ${rootDir} == "" ]] ; then
    export rootDir="$(cd "$(dirname -- "$dir/../../..")" && pwd )"
  fi
  export resourcesDir="${rootDir}/resources"
  export scriptDir="${rootDir}/scripts"
  export configDir="${rootDir}/config"
  export coreConfigFile="${configDir}/core.json"
  export configFile="${dir}/env.json"
  export PATH="$rootDir/node_modules/.bin:$PATH"
  export defaultRegion=$(jq -r '.defaultRegion' ${coreConfigFile})
  export defaultStage=$(jq -r '.defaultStage' ${coreConfigFile})

  cd $rootDir
  npm i
  cd $dir
fi