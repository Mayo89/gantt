import { DateTime, Interval } from 'luxon';

export class GanttHorizon {
	start: DateTime;
	end: DateTime;
	interval: Interval;

	constructor() {
		this.start = DateTime.now().minus({ months: 1 });
		this.end = this.start.plus({ months: 3 });
		this.interval = Interval.fromDateTimes(this.start, this.end);
	}

	hours() {
		return this.interval.length('hours');
	}

	days() {
		return this.interval.length('days');
	}

	weeks() {
		return this.interval.length('weeks');
	}

	months() {
		return this.interval.length('months');
	}

	years() {
		return this.interval.length('years');
	}
}
