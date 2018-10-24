export interface IEventData<T> {
    recorded: Date;
    payload: T;
    channel: string;
}
