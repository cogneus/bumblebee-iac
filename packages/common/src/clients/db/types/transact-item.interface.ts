import { PutCommandInput, UpdateCommandInput, DeleteCommandInput } from '@aws-sdk/lib-dynamodb'
import { ConditionCheck } from '@aws-sdk/client-dynamodb'

export interface TransactItem {
  Put?: PutCommandInput
  Update?: UpdateCommandInput
  Delete?: DeleteCommandInput
  ConditionCheck?: ConditionCheck
}
