import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm";
import { Config } from "../../scripts/config";

export const getSSMValue = async (
  name: string,
  config: Config,
  defaultValue: string
) => {
  let result;
  try {
    const { region } = config;
    const client = new SSMClient({
      region,
    });
    result = await client.send(
      new GetParameterCommand({
        Name: name,
        WithDecryption: false,
      })
    );
  } finally {
  }

  return result?.Parameter?.Value ?? defaultValue;
};
