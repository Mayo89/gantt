import type { GanttWorker } from './Worker';

export class GanttRow {
	worker: GanttWorker;

	constructor(worker: GanttWorker) {
		this.worker = worker;
	}
}
