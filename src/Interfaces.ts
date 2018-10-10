export interface IEventDomain {
	domain: string;
	channels: string[];
}

export interface IEventSubscription {
	domain: string;
	channel: string;
	callback: EventCallback;
}

export interface IEventBroadcast<T> {
	payload: T;
	domain: string;
	channel: string;
}

export type EventCallback = (payload: {}) => void;