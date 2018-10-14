export interface IEventSubscription {
  domain: string
  channel: string
  callback: EventCallback
}

export interface IEventBroadcast<T> {
  payload: T
  domain: string
  channel?: null | string
}

export type EventCallback = (payload: any) => void
export type MiddlewareCallback<T> = (e: IEventBroadcast<T>, next: MiddlewareNext<T>) => void
export type MiddlewareNext<T> = (e: IEventBroadcast<T>) => T
// export type MiddlewareNext<T> = () => void;

export interface IDomainEvent<T> extends IEventBroadcast<T> {
  recorded?: Date
}
