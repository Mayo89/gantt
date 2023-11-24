import { GanttWorker } from './Worker';

export class Task {
	name: string;
	worker: GanttWorker | null = null;

	constructor(name: string) {
		this.name = name;
	}
}
