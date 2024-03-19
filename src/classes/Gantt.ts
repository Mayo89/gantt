import { DateTime } from 'luxon';
import { labelWidth, pixelsPerHour, rowHeight } from './Constants';
import { GanttHorizon } from './GanttHorizon';
import { GanttRow } from './GanttRow';
import { Task } from './Task';
import { getRandom } from './Utility';
import { GanttWorker } from './Worker';
import { WorkHours } from './Workhours';

export class Gantt {
	rows: Array<GanttRow> = [];
	horizon: GanttHorizon;
	workHours: WorkHours;
	workDays: Array<number> = [];

	constructor() {
		this.rows = [];
		this.horizon = new GanttHorizon();
		this.workHours = new WorkHours();
		this.workDays = [1, 2, 3, 4, 5];
	}

	render() {
		const dateDiv = document.getElementsByClassName('dates')[0];

		const monthRow = document.createElement('div');
		monthRow.classList.add('flex', 'flex-row', 'border-b');

		const weekRow = document.createElement('div');
		weekRow.classList.add('flex', 'flex-row', 'border-b');

		const dayRow = document.createElement('div');
		dayRow.classList.add('flex', 'flex-row', 'border-b');

		const hourRow = document.createElement('div');
		hourRow.classList.add('flex', 'flex-row', 'border-t');
		let previousDate = null;
		let dayWidth = pixelsPerHour;
		let weekWidth = pixelsPerHour;
		let monthWidth = pixelsPerHour;

		const ganttCanvas = document.getElementById(
			'ganttCanvas',
		) as HTMLCanvasElement;

		ganttCanvas.style.width = `${this.width()}px`;
		ganttCanvas.style.height = `${this.height()}px`;
		// Set actual size in memory (scaled to account for extra pixel density).
		const scale = window.devicePixelRatio; // Change to 1 on retina screens to see blrry canvas.
		ganttCanvas.width = Math.floor(this.width() * scale);
		ganttCanvas.height = Math.floor(this.height() * scale);

		const ctx = ganttCanvas.getContext('2d') as CanvasRenderingContext2D;

		// Normalize coordinate system to use CSS pixels.
		ctx.scale(scale, scale);

		ctx.strokeStyle = '#F4F7F5';
		ctx.lineWidth = 1;

		let currentX = -0.5;

		for (let i = 0; i < this.horizon.hours(); i++) {
			const newDate = this.horizon.start.plus({ hours: i });

			if (!previousDate) {
				previousDate = newDate;
				continue;
			}

			if (previousDate.month !== newDate.month) {
				const monthDiv = document.createElement('div');
				monthDiv.innerText = `${previousDate.monthLong} ${previousDate.year}`;
				monthDiv.classList.add('border-l', 'py-1');
				monthDiv.style.width = `${monthWidth}px`;
				monthRow.appendChild(monthDiv);
				monthWidth = 0;
			}

			if (previousDate.weekNumber !== newDate.weekNumber) {
				const weekDiv = document.createElement('div');
				weekDiv.innerText = previousDate.weekNumber.toString();
				weekDiv.classList.add('border-l', 'py-1');
				weekDiv.style.width = `${weekWidth}px`;
				weekRow.appendChild(weekDiv);
				weekWidth = 0;
			}

			if (previousDate.day !== newDate.day) {
				if (!this.workDays.includes(previousDate.weekday)) {
					ctx.fillStyle = '#556162';
					ctx.beginPath();

					ctx.fillRect(currentX, 0, dayWidth, ganttCanvas.height);
				}

				currentX += dayWidth;

				ctx.beginPath();
				ctx.moveTo(currentX, 0);
				ctx.lineTo(currentX, ganttCanvas.height);
				ctx.stroke();

				const dayDiv = document.createElement('div');
				dayDiv.innerText = previousDate.day.toString();
				dayDiv.classList.add('border-l', 'py-1');
				dayDiv.style.width = `${dayWidth}px`;
				dayRow.appendChild(dayDiv);
				dayWidth = 0;
			}

			if (pixelsPerHour >= 24) {
				const hourDiv = document.createElement('div');

				hourDiv.innerText = newDate.hour.toString();
				hourDiv.classList.add('border-l', 'py-1');
				hourDiv.style.width = `${pixelsPerHour}px`;
				hourRow.appendChild(hourDiv);
			}

			dayWidth += pixelsPerHour;
			weekWidth += pixelsPerHour;
			monthWidth += pixelsPerHour;
			previousDate = newDate;
		}

		dateDiv?.appendChild(monthRow);
		dateDiv?.appendChild(weekRow);
		dateDiv?.appendChild(dayRow);

		if (pixelsPerHour >= 24) {
			dateDiv?.appendChild(hourRow);
		}

		const now = DateTime.now();
		const nowX = Math.floor(
			now.diff(this.horizon.start, 'hours').hours * pixelsPerHour,
		);

		ctx.strokeStyle = '#FF3366';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(nowX, 0);
		ctx.lineTo(nowX, ganttCanvas.height);
		ctx.stroke();

		const nowDot = document.createElement('div');
		nowDot.classList.add('now-dot');
		nowDot.style.marginLeft = `${nowX - 7.5}px`;
		dateDiv.appendChild(nowDot);

		const ganttDiv = document.getElementById('ganttDiv') as HTMLDivElement;

		for (const r of this.rows) {
			ganttDiv.appendChild(r.render(this.horizon.start));
		}

		return this;
	}

	generateWorkers(numWorkers = 100) {
		for (let i = 1; i <= numWorkers; i++) {
			const worker = new GanttWorker(`worker-${i}`);

			for (let j = 1; j < getRandom(1, 20); j++) {
				let start = this.horizon.start.plus({
					hour: getRandom(1, this.horizon.hours()),
				});

				if (!this.workDays.includes(start.weekday)) {
					start = start.set({ weekNumber: start.weekNumber + 1, weekday: 1 });
				}

				const duration = getRandom(8, 48);
				let end = start.plus({ hour: duration });

				if (!this.workDays.includes(end.weekday)) {
					start = start.set({ weekday: 3 });
					end = start.plus({ hour: duration });
				}

				worker.addTask(
					new Task(j, `Task ${j}`, start, end, this.horizon.start),
				);
			}

			this.addWorkerRow(worker);
		}

		return this;
	}

	addWorkerRow(worker: GanttWorker) {
		this.rows.push(new GanttRow(worker));
	}

	width() {
		return this.horizon.hours() * pixelsPerHour - labelWidth;
	}

	height() {
		return this.rows.length * rowHeight;
	}
}
