import { Task } from './Task';

export class GanttWorker {
	id: string;
	name: string;
	tasks: Array<Task> = [];

	constructor(name: string) {
		this.id = crypto.randomUUID();
		this.name = name;
	}

	addTask(task: Task) {
		this.tasks.push(task);
	}
}
