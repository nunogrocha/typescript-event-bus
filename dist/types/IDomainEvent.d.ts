import { IEventData } from './IEventData';
export interface IDomainEvent<T> extends IEventData<T> {
    toJSON(): IEventData<T>;
}
