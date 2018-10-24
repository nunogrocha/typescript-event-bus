import { IDomainEvent } from './IDomainEvent';
import { IEventData } from './IEventData';
export declare class DomainEvent<T> implements IDomainEvent<T> {
    private _channel;
    private _payload;
    private _recorded;
    readonly recorded: Date;
    readonly payload: T;
    readonly channel: string;
    constructor(_channel: string, _payload: T);
    toJSON(): IEventData<T>;
}
