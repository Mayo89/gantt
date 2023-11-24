import { Task } from './Task';

export class GanttWorker {
	id: number;
	name: string;
	tasks: Array<Task> = [];

	constructor(name: string) {
		this.id = 1;
		this.name = name;
	}

	addTask(task: Task) {
		this.tasks.push(task);
	}
}
