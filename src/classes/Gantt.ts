import { GanttHorizon } from './GanttHorizon';
import { GanttRow } from './GanttRow';
import { GanttWorker } from './Worker';

export class Gantt {
	rows: Array<GanttRow> = [];
	horizon: GanttHorizon;
	pixelsPerHour = 3;

	constructor() {
		this.rows = [];
		this.horizon = new GanttHorizon();
	}

	addWorker(worker: GanttWorker) {
		this.rows.push(new GanttRow(worker));
	}

	getRows() {
		return this.rows;
	}
}
