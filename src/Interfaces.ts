export interface IEventSubscription {
	domain: string;
	channel: string;
	callback: EventCallback;
}

export interface IEventBroadcast<T> {
	payload: T;
	domain: string;
	channel?: null | string;
}

export type EventCallback = (payload: any) => void;

export interface IDomainEvent<T> extends IEventBroadcast<T> {
	recorded?: Date;
}