import 'core-js/fn/array/find';
import 'core-js/fn/array/filter';
import { IEventBus } from './IEventBus';
import { IEventSubscription } from './IEventSubscription';
import { IDomainEvent } from './IDomainEvent';
import { IEventHandler } from './IEventHandler';
import { MiddlewareCallback } from './types';
export declare class EventBus implements IEventBus {
    private _middleware;
    private _subscriptions;
    readonly middleware: MiddlewareCallback<any>[];
    readonly subscriptions: IEventSubscription[];
    constructor(middleware?: MiddlewareCallback<any>[]);
    /**
     * Clears all subscription
     */
    unregisterAll(): boolean;
    /**
     * Releases a channel and subscribers from the event processor
     * @param domain
     */
    unregister(channel: string): boolean;
    /**
     * Registers a subscription to a domains channel
     * @param subscription
     */
    register(subscription: IEventSubscription): IEventHandler;
    /**
     * Notifies domains channel subscribers
     */
    trigger<T>(event: IDomainEvent<T>): void;
    private process;
}
