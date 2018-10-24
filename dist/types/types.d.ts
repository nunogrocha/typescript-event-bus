import { IDomainEvent } from './IDomainEvent';
export declare type EventCallback = (payload: any) => void;
export declare type MiddlewareCallback<T> = (e: IDomainEvent<T>, next: MiddlewareNext<T>) => void;
export declare type MiddlewareNext<T> = (e: IDomainEvent<T>) => T;
