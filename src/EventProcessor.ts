import "core-js/fn/array/find";
import "core-js/fn/array/filter";
import { IEventSubscription, IEventBroadcast, IDomainEvent } from "./Interfaces";
import DomainEvent from "./DomainEvent";

export default abstract class EventProcessor {
	private _log: DomainEvent<any>[];
	private _subscriptions: IEventSubscription[];

	constructor(private isLogging: boolean) {
		this._subscriptions = [];
		if (this.isLogging) {
			this._log = [];
		}
	}

	/**
	 * Releases a domain and all its channels and subscribers from the event processor
	 * @param domain 
	 */
	disconnectDomain(domain: string) {
		if (domain) {
			this._subscriptions = this._subscriptions.filter(s => s.domain !== domain);
			return true;
		}
		return false;
	}

	/**
	 * Adds a subscription to a domains channel
	 * @param subscription 
	 */
	subscribe(subscription: IEventSubscription) {
		const that = this;
		const index = this._subscriptions.push(subscription);
		return {
			index: index,
			unsubscribe: function() {
				that._subscriptions.splice(index - 1, 1);
			}
		}
	}

	/**
	 * Notifies domains channel subscribers
	 */
	broadcastChannel<T>(e: IEventBroadcast<T>) {
		this._subscriptions.forEach(sub => {
			if (sub.channel === e.channel && sub.domain === e.domain) {
				this.process(e, sub);
			}
		});
	}

	/**
	 * Notifies domains channel subscribers
	 */
	broadcastDomain<T>(e: IEventBroadcast<T>) {
		this._subscriptions.forEach(sub => {
			if (sub.domain === e.domain) {
				this.process(e, sub);
			}
		});
	}

	private process<T>(e: IEventBroadcast<T>, sub: IEventSubscription) {
		if (this.isLogging) {
			this._log.push(new DomainEvent<T>({
				payload: e.payload,
				domain: e.domain,
				channel: e.channel
			}))
		}
		sub.callback(e.payload)
	}

	get logs(): IDomainEvent<any>[] {
		return this._log.map(log => log.toJSON());
	}
}