import type { DateTime } from 'luxon';
import { labelWidth, pixelsPerHour } from './Constants';
import type { GanttWorker } from './Worker';
import { dragstartHandler } from './events/Dragging';

export class Task {
	id: number;
	name: string;
	worker: GanttWorker | null = null;
	startDate: DateTime;
	endDate: DateTime;
	element: HTMLDivElement;

	constructor(
		id: number,
		name: string,
		startDate: DateTime,
		endDate: DateTime,
		horizonStart: DateTime,
	) {
		this.id = id;
		this.name = name;
		this.startDate = startDate;
		this.endDate = endDate;

		this.element = this.render(horizonStart);
	}

	render(horizonStart: DateTime) {
		const taskDiv = document.createElement('div');
		const start =
			labelWidth +
			Math.floor(
				this.startDate.diff(horizonStart, 'hours').hours * pixelsPerHour,
			);
		const length = Math.floor(
			this.endDate.diff(this.startDate, 'hours').hours * pixelsPerHour,
		);

		taskDiv.style.marginLeft = `${start}px`;
		taskDiv.style.width = `${length}px`;

		taskDiv.id = `${this.worker?.id}-${this.id}`;
		taskDiv.ondragstart = dragstartHandler;
		taskDiv.draggable = true;

		taskDiv.classList.add(
			'gantt-item',
			'absolute',
			'rounded',
			'my-1',
			'text-slate-900',
			'hover:cursor-move',
		);
		taskDiv.innerText = this.name;

		return taskDiv;
	}
}
