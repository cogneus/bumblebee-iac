import { Construct } from 'constructs';
import { Architecture, Code, Function, FunctionProps, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Duration } from 'aws-cdk-lib';
import path = require('path');

export interface CoreFunctionProps extends Partial<FunctionProps> {
  entry: string
}

export class CoreFunction extends Function {
  constructor(
    scope: Construct,
    id: string,
    props: CoreFunctionProps
  ) {
    super(scope, id, {
      runtime: Runtime.NODEJS_20_X,
      architecture: Architecture.ARM_64,
      timeout: Duration.seconds(10),
      memorySize: 512,
      handler: 'index.main',
      code: Code.fromAsset(path.join(__dirname, `../../dist/${props.entry}`)),
      ...props
    });
  }
}
