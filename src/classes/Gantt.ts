import { GanttHorizon } from './GanttHorizon';
import { GanttRow } from './GanttRow';
import { GanttWorker } from './Worker';
import { WorkHours } from './Workhours';

export class Gantt {
	rows: Array<GanttRow> = [];
	horizon: GanttHorizon;
	pixelsPerHour = 4;
	workHours: WorkHours;
	workDays: Array<number> = [];

	constructor() {
		this.rows = [];
		this.horizon = new GanttHorizon();
		this.workHours = new WorkHours();
		this.workDays = [1, 2, 3, 4, 5];
	}

	addWorker(worker: GanttWorker) {
		this.rows.push(new GanttRow(worker));
	}

	getRows() {
		return this.rows;
	}

	width() {
		return this.horizon.hours() * this.pixelsPerHour - 112;
	}

	height() {
		return this.rows.length * 28.8;
	}
}
