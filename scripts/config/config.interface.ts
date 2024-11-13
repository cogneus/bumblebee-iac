export interface Config {
  regionCode: string
  prefix: {
    ssm: string
    name: string
    qual: string
  }
  s3: {
    templateBucketSuffix: string
    artifactBucket: string
    cdkBucket: string
    templateBucket: string
  }
  ssm: {
    kmsArn: string
    githubToken: string
    replicationRole: string
    activeStage: string
  }
  secrets: {
    prefix: string
    signKey: {
      name: string
    }
    tokens: {
      name: string
    }
    users: {
      name: string
    }
  }
  tags: {
    costCenter: string
    envName: string
    productName: string
    componentName: string
    owner: string
  }
  iam: {
    roleArnPrefix: string
    s3crRole: string
    permissionsBoundary: string
    codebuildRole: string
    codepipelineRole: string
    cloudformationRole: string
    kmsRole: string
    githubConnectionRole: string
    iamRootArn: string
    adminRole: string
    permissionsBoundaryName: string
  }
  costCenter: string
  productName: string
  productRef: string
  ownerEmail: string
  deployStages: {
    blue: string
    green: string
  }
  stages: string []
  defaultComponent: string
  components: {
    app: string
    auth: string
    platform: string
  }
  defaultStage: string
  regions: string []
  defaultRegion: string
  regionCodes: {
    "us-east-1": string
    "eu-west-1": string
  }
  github: {
    repoId: string
    branch: string
    connectionId: string
  }
  apiMappings: {
    app: string
  }
  prune: {
    number: number
  }
  logLevel: string
  awsAccountId: string
  environmentName: string
  allowedOrigins: string[]
  route53HostedZone: string
  sso: {
    adminRole: string
  }
  component: string
  region: string
  stage: string
  deployStage: string
  componentName: string
}