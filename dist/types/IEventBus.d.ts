import { IDomainEvent } from './IDomainEvent';
import { IEventSubscription } from './IEventSubscription';
import { IEventHandler } from './IEventHandler';
export interface IEventBus {
    trigger<T>(event: IDomainEvent<T>): void;
    register(subscription: IEventSubscription): IEventHandler;
    unregister(channel: string): boolean;
    unregisterAll(): boolean;
}
