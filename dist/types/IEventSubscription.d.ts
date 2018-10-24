import { EventCallback } from './types';
export interface IEventSubscription {
    channel: string;
    callback: EventCallback;
}
