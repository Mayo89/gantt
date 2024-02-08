import { DateTime } from 'luxon';
import { GanttWorker } from './Worker';

export class Task {
	id: number;
	name: string;
	worker: GanttWorker | null = null;
	startDate: DateTime;
	endDate: DateTime;

	constructor(id: number, name: string, startDate: DateTime, endDate: DateTime) {
		this.id = id;
		this.name = name;
		this.startDate = startDate;
		this.endDate = endDate;
	}
}
