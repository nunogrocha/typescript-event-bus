import { IDomainEvent } from "./Interfaces";

export default class DomainEvent<T> {
	private _recorded: Date;

	constructor(private evt: IDomainEvent<T>) {
		this._recorded = evt.recorded || new Date();
	}

	toJSON(): IDomainEvent<T> {
		return {
			payload: this.evt.payload,
			domain: this.evt.domain,
			channel: this.evt.channel,
			recorded: this._recorded
		}
	}
}