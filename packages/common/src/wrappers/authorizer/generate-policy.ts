import { Token } from '../../auth'
import { APIGatewayInfo } from './types'

export const generatePolicy = async ({ arn }: APIGatewayInfo, token?: Token) => ({
  principalId: token?.email ?? 'unknown',
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: token ? 'Allow' : 'Deny',
        Resource: `${arn}/*`,
      },
    ],
  },
})
