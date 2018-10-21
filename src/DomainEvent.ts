import { IDomainEvent } from './IDomainEvent'
import { IEventData } from './IEventData'

export class DomainEvent<T> implements IDomainEvent<T> {
  private _recorded: Date

  get recorded() {
    return this._recorded
  }

  get payload() {
    return this._payload
  }

  get channel() {
    return this._channel
  }

  constructor(private _channel: string, private _payload: T) {
    this._recorded = new Date()
  }

  toJSON(): IEventData<T> {
    return {
      payload: this.payload,
      channel: this.channel,
      recorded: this.recorded
    }
  }
}
