import "core-js/fn/array/find";
import "core-js/fn/array/filter";
import { IEventDomain, IEventSubscription, IEventBroadcast } from "./Interfaces";

export default abstract class EventProcessor {
	domains: IEventDomain[];
	subscriptions: IEventSubscription[];

	constructor() {
		this.domains = [];
		this.subscriptions = [];
	}

	/**
	 * Adds a domain to the event processor
	 * @param domain 
	 */
	connect(domain: IEventDomain) {
		this.domains.push(domain);
	}

	/**
	 * Releases a domain from the event processor
	 * @param domain 
	 */
	disconnect(domain: string) {
		this.domains = this.domains.filter(d => d.domain === domain);
	}

	/**
	 * Adds a subscription to a domains channel
	 * @param subscription 
	 */
	subscribe(subscription: IEventSubscription) {
		const that = this;
		const index = this.subscriptions.push(subscription);
		return {
			unsubscribe: function() {
				that.subscriptions.splice(index, 1);
			}
		}
	}

	/**
	 * Notifies domains channel subscribers
	 */
	broadcast<T>(e: IEventBroadcast<T>) {
		const subscription = this.subscriptions.find(sub => sub.channel === e.channel && sub.domain === e.domain);
		if (subscription) {
			subscription.callback(e.payload);
		}
	}
}