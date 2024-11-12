import { Callback, Handler } from 'aws-lambda'

export const warmupWrapper = <T extends Handler = Handler>(handler: T): T =>
  ((event: any, context: any, callback: Callback) =>
    event.source === 'serverless-plugin-warmup'
      ? callback(null, 'warmup success')
      : handler(event, context, callback)) as T
