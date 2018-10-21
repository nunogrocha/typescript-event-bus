import { IDomainEvent } from './IDomainEvent'

export type EventCallback = (payload: any) => void
export type MiddlewareCallback<T> = (e: IDomainEvent<T>, next: MiddlewareNext<T>) => void
export type MiddlewareNext<T> = (e: IDomainEvent<T>) => T
