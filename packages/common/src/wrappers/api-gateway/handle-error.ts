import { APIGatewayProxyResultV2 } from 'aws-lambda'
import { AppException, StatusCodes } from '../../exceptions'
import { APIResponseHeaders } from './consts'

const forbidenErrorBody = {
  message: 'forbidden',
}
export const handleError = ({
  code,
  message,
  status,
}: Error & AppException): APIGatewayProxyResultV2 => ({
  statusCode: status || StatusCodes.Error,
  headers: APIResponseHeaders,
  body: JSON.stringify(
    status === StatusCodes.Forbidden
      ? forbidenErrorBody
      : {
          message,
          code,
        }
  ),
})
