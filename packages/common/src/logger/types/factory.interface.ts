export type Factory<TInstance> = () => TInstance

export type FactoryWithInput<TInstance, TInput> = (input: TInput) => TInstance
