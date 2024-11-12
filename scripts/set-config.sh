while (("$#")); do
  case "$1" in
  --stage)
    stage=$2
    shift 2
    ;;
  --region)
    region=$2
    shift 2
    ;;
  --component)
    component=$2
    shift 2
    ;;
  --branch)
    branch=$2
    shift 2
    ;;    
  --) # end argument parsing
    shift
    break
    ;;
  -* | --*=) # unsupported flags
    exit 1
    ;;
  esac
done

ts-node -e '
  require("'$scriptDir'/config/set-config.ts")
  .main({
    "coreConfigFile": "'$coreConfigFile'",
    "configFile": "'$configFile'",
    "environmentName": "'$environmentName'",
    "stage": "'$stage'",
    "region": "'$region'",
    "component": "'$component'",
    "branch": "'$branch'",
    })
'