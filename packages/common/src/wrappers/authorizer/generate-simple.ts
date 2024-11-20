import { APIGatewaySimpleAuthorizerResult } from "aws-lambda";
import { Token } from "../../auth";

export const generateSimple = async (
  token?: Token
): Promise<APIGatewaySimpleAuthorizerResult> => ({
  isAuthorized: Boolean(token),
});
