import type { DateTime } from 'luxon';
import { GanttItemData } from './GanttItemData';
import type { GanttWorker } from './Worker';

export class Task extends GanttItemData {
	worker: GanttWorker | null = null;

	constructor(
		id: number,
		text: string,
		startDate: DateTime,
		endDate: DateTime,
		horizonStart: DateTime,
	) {
		super(id, startDate, endDate, text, horizonStart);
	}
}
