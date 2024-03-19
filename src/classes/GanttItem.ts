import type { DateTime } from 'luxon';
import { labelWidth, pixelsPerHour } from './Constants';
import type { GanttItemData } from './GanttItemData';
import { dragstartHandler } from './events/Dragging';

/**
 * Based on an underlying data object this class handles the rendering of a single item on the Gantt
 */
export class GanttItem {
	data: GanttItemData;

	constructor(data: GanttItemData) {
		this.data = data;
	}

	render(horizonStart: DateTime) {
		const itemDiv = document.createElement('div');
		const start =
			labelWidth +
			Math.floor(
				this.data.startDate.diff(horizonStart, 'hours').hours * pixelsPerHour,
			);
		const length = Math.floor(
			this.data.endDate.diff(this.data.startDate, 'hours').hours *
				pixelsPerHour,
		);

		itemDiv.style.marginLeft = `${start}px`;
		itemDiv.style.width = `${length}px`;

		itemDiv.id = `${this.data.id}`;
		itemDiv.ondragstart = dragstartHandler;
		itemDiv.draggable = true;

		itemDiv.classList.add(
			'gantt-item',
			'absolute',
			'rounded',
			'my-1',
			'text-slate-900',
			'hover:cursor-move',
		);
		itemDiv.innerText = this.data.text;

		return itemDiv;
	}
}
