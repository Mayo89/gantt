import type { DateTime } from 'luxon';

export class GanttItemData {
	id: number;
	startDate: DateTime;
	endDate: DateTime;
	text: string;
	horizonStart: DateTime;

	constructor(
		id: number,
		startDate: DateTime,
		endDate: DateTime,
		text: string,
		horizonStart: DateTime,
	) {
		this.id = id;
		this.startDate = startDate;
		this.endDate = endDate;
		this.text = text;
		this.horizonStart = horizonStart;
	}
}
