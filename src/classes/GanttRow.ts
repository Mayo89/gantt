import { DateTime } from 'luxon';
import { GanttItem } from './GanttItem';
import type { GanttWorker } from './Worker';
import {
	dragEnter,
	dragLeave,
	dragoverHandler,
	dropHandler,
} from './events/Dragging';

export class GanttRow {
	worker: GanttWorker;

	constructor(worker: GanttWorker) {
		this.worker = worker;
	}

	render(horizonStart: DateTime) {
		const rowDiv = document.createElement('div');
		rowDiv.id = `worker-${this.worker.id}`;
		rowDiv.classList.add('flex', 'border-b', 'gantt-row', 'z-10');

		rowDiv.ondrop = dropHandler;
		rowDiv.ondragover = dragoverHandler;
		rowDiv.ondragenter = dragEnter;
		rowDiv.ondragleave = dragLeave;

		const label = document.createElement('div');
		label.classList.add('w-32', 'py-1');
		label.innerText = this.worker.name;
		rowDiv.appendChild(label);

		for (const t of this.worker.tasks) {
			rowDiv.appendChild(new GanttItem(t).render(horizonStart));
		}

		return rowDiv;
	}
}
