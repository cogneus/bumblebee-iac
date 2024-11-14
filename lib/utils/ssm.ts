import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm"
import { Config } from "../../scripts/config"

export const getSSMValue = async (name: string, config: Config, defaultValue: string) => {
  const { region } = config
  const client = new SSMClient({
    region,
  })
  const result = await client.send(new GetParameterCommand({
    Name: name,
    WithDecryption: false,
  }))
  return result.Parameter?.Value || defaultValue
}
