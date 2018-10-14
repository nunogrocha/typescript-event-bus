import 'core-js/fn/array/find'
import 'core-js/fn/array/filter'
import { IEventSubscription, IEventBroadcast, IDomainEvent, MiddlewareCallback } from './Interfaces'

export default abstract class EventProcessor {
  private _middleware: MiddlewareCallback<any>[]
  private _subscriptions: IEventSubscription[]

  constructor(middleware?: MiddlewareCallback<any>[]) {
    this._subscriptions = []
    this._middleware = middleware ? [...middleware] : []
  }

  /**
   * Releases a domain and all its channels and subscribers from the event processor
   * @param domain
   */
  disconnectDomain(domain: string) {
    if (domain) {
      this._subscriptions = this._subscriptions.filter(s => s.domain !== domain)
      return true
    }
    return false
  }

  /**
   * Adds a subscription to a domains channel
   * @param subscription
   */
  subscribe(subscription: IEventSubscription) {
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
  broadcastChannel<T>(e: IEventBroadcast<T>) {
    this._subscriptions.forEach(sub => {
      if (sub.channel === e.channel && sub.domain === e.domain) {
        this.process(e, sub)
      }
    })
  }

  /**
   * Notifies domains channel subscribers
   */
  broadcastDomain<T>(e: IEventBroadcast<T>) {
    this._subscriptions.forEach(sub => {
      if (sub.domain === e.domain) {
        this.process(e, sub)
      }
    })
  }

  private process<T>(e: IEventBroadcast<T>, sub: IEventSubscription) {
    const middleware: MiddlewareCallback<any>[] = [].concat(this._middleware)

    function run(e: IEventBroadcast<T>) {
      if (middleware.length === 0) {
        return sub.callback(e.payload)
      } else {
        const first: MiddlewareCallback<any> = middleware.splice(0, 1)[0]
        return first(e, run)
      }
    }

    return run(e)
  }
}
