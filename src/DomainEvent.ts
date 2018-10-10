export default abstract class DomainEvent {
	private recorded: Date;

	constructor(occurred: Date) {
		this.recorded = new Date();
	}

	abstract process(): void
}