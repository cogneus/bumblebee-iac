import { Construct } from "constructs";
import {
  Function,
  FunctionProps,
  InlineCode,
  Runtime,
} from "aws-cdk-lib/aws-lambda";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";

export const addAPIFunction = (
  scope: Construct,
  stackPrefix: string,
  name: string,
  description: string
) => {
  const functionName = `${stackPrefix}-api-${name}`;
  const lambdaFunction = new Function(scope, functionName, {
    runtime: Runtime.NODEJS_18_X,
    handler: "index.handler",
    code: new InlineCode('exports.handler = _ => "Hello, CDK";'),
    functionName,
    description
  });

  return new LambdaIntegration(lambdaFunction);
};
