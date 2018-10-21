import 'core-js/fn/array/find'
import 'core-js/fn/array/filter'
import { IEventBus } from './IEventBus'
import { IEventSubscription } from './IEventSubscription'
import { IDomainEvent } from './IDomainEvent'
import { IEventHandler } from './IEventHandler'
import { MiddlewareCallback } from './types'

export class EventBus implements IEventBus {
  private _middleware: MiddlewareCallback<any>[]
  private _subscriptions: IEventSubscription[]

  get middleware() {
    return this._middleware
  }

  get subscriptions() {
    return this._subscriptions
  }

  constructor(middleware?: MiddlewareCallback<any>[]) {
    this._subscriptions = []
    this._middleware = middleware ? [...middleware] : []
  }

  /**
   * Clears all subscription
   */
  unregisterAll(): boolean {
    this._subscriptions = []
    return true
  }

  /**
   * Releases a channel and subscribers from the event processor
   * @param domain
   */
  unregister(channel: string): boolean {
    if (channel) {
      this._subscriptions = this._subscriptions.filter(s => s.channel !== channel)
      return true
    }
    return false
  }

  /**
   * Registers a subscription to a domains channel
   * @param subscription
   */
  register(subscription: IEventSubscription): IEventHandler {
    const that = this
    const index = this._subscriptions.push(subscription)
    return {
      index: index,
      unsubscribe: function() {
        that._subscriptions.splice(index - 1, 1)
      }
    }
  }

  /**
   * Notifies domains channel subscribers
   */
  trigger<T>(event: IDomainEvent<T>): void {
    this._subscriptions.forEach(sub => {
      if (sub.channel === event.channel) {
        this.process(event, sub)
      }
    })
  }

  private process<T>(event: IDomainEvent<T>, sub: IEventSubscription) {
    const middleware: MiddlewareCallback<any>[] = [].concat(this._middleware)

    function run(event: IDomainEvent<T>) {
      if (middleware.length === 0) {
        return sub.callback(event.payload)
      } else {
        const first: MiddlewareCallback<any> = middleware.splice(0, 1)[0]
        return first(event, run)
      }
    }

    return run(event)
  }
}
