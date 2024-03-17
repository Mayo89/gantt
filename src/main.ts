import { DateTime } from 'luxon';
import { Gantt } from './classes/Gantt';
import { Task } from './classes/Task';
import { GanttWorker } from './classes/Worker';
import './style.css';

function getRandom(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

const gantt = new Gantt();

for (let i = 1; i <= 100; i++) {
	const worker = new GanttWorker(`worker-${i}`);

	for (let j = 1; j < getRandom(1, 20); j++) {
		let start = gantt.horizon.start.plus({
			hour: getRandom(1, gantt.horizon.hours()),
		});

		if (!gantt.workDays.includes(start.weekday)) {
			start = start.set({ weekNumber: start.weekNumber + 1, weekday: 1 });
		}

		const duration = getRandom(8, 48);
		let end = start.plus({ hour: duration });

		if (!gantt.workDays.includes(end.weekday)) {
			start = start.set({ weekday: 3 });
			end = start.plus({ hour: duration });
		}

		worker.addTask(new Task(j, `Task ${j}`, start, end));
	}

	gantt.addWorker(worker);
}

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
let dayWidth = gantt.pixelsPerHour;
let weekWidth = gantt.pixelsPerHour;
let monthWidth = gantt.pixelsPerHour;

const ganttDiv = document.getElementById('ganttDiv') as HTMLDivElement;
const ganttCanvas = document.getElementById('ganttCanvas') as HTMLCanvasElement;

ganttCanvas.style.width = `${gantt.width()}px`;
ganttCanvas.style.height = `${gantt.height()}px`;
// Set actual size in memory (scaled to account for extra pixel density).
const scale = window.devicePixelRatio; // Change to 1 on retina screens to see blrry canvas.
ganttCanvas.width = Math.floor(gantt.width() * scale);
ganttCanvas.height = Math.floor(gantt.height() * scale);

const ctx = ganttCanvas.getContext('2d') as CanvasRenderingContext2D;

// Normalize coordinate system to use CSS pixels.
ctx.scale(scale, scale);

ctx.strokeStyle = '#F4F7F5';
ctx.lineWidth = 1;

let currentX = -0.5;

for (let i = 0; i < gantt.horizon.hours(); i++) {
	const newDate = gantt.horizon.start.plus({ hours: i });

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
		if (!gantt.workDays.includes(previousDate.weekday)) {
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

	if (gantt.pixelsPerHour >= 24) {
		const hourDiv = document.createElement('div');

		hourDiv.innerText = newDate.hour.toString();
		hourDiv.classList.add('border-l', 'py-1');
		hourDiv.style.width = `${gantt.pixelsPerHour}px`;
		hourRow.appendChild(hourDiv);
	}

	dayWidth += gantt.pixelsPerHour;
	weekWidth += gantt.pixelsPerHour;
	monthWidth += gantt.pixelsPerHour;
	previousDate = newDate;
}

dateDiv?.appendChild(monthRow);
dateDiv?.appendChild(weekRow);
dateDiv?.appendChild(dayRow);

if (gantt.pixelsPerHour >= 24) {
	dateDiv?.appendChild(hourRow);
}

const now = DateTime.now();
const nowX = Math.floor(
	now.diff(gantt.horizon.start, 'hours').hours * gantt.pixelsPerHour,
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

let dragging = null as HTMLDivElement | null;

function dragstartHandler(ev: DragEvent) {
	if (!ev.dataTransfer || !ev.target) return;

	const target = ev.target as HTMLDivElement;

	target.style.opacity = '0.4';

	dragging = target;
	ev.dataTransfer.dropEffect = 'move';
}

function dragoverHandler(ev: DragEvent) {
	ev.preventDefault();

	if (!ev.dataTransfer) return;

	ev.dataTransfer.dropEffect = 'move';
}

function dropHandler(ev: DragEvent) {
	ev.preventDefault();

	if (!ev.target || !dragging) return;

	const target = ev.target as HTMLDivElement;

	dragging.style.marginLeft = `${ev.clientX}px`;
	dragging.style.opacity = '1';
	dragging.parentNode?.removeChild(dragging);
	target.appendChild(dragging);

	target.classList.remove('hover');
}

function dragEnter(event: DragEvent) {
	if (!event.target) return;

	const target = event.target as HTMLDivElement;
	// highlight potential drop target when the draggable element enters it
	if (target.classList.contains('gantt-row')) {
		target.classList.add('hover');
	}
}

function dragLeave(event: DragEvent) {
	if (!event.target) return;

	const target = event.target as HTMLElement;

	// reset background of potential drop target when the draggable element leaves it
	if (target.classList.contains('gantt-row')) {
		target.classList.remove('hover');
	}
}

const selectedItems: Array<HTMLElement> = [];

document.onclick = (e: MouseEvent) => {
	const element = e.target as HTMLElement;

	if (element.classList.contains('gantt-item')) {
		ganttItemClick(e);
	} else {
		for (const i of selectedItems) {
			i.classList.remove('selected');
		}
		selectedItems.length = 0;
	}
};

function ganttItemClick(e: MouseEvent) {
	if (!e.target) return;

	const target = e.target as HTMLElement;

	target.classList.add('selected');

	if (!e.ctrlKey) {
		for (const i of selectedItems) {
			i.classList.remove('selected');
		}
		selectedItems.length = 0;
	}

	selectedItems.push(target);
}

for (const r of gantt.rows) {
	const rowDiv = document.createElement('div');
	rowDiv.id = `worker-${r.worker.id}`;
	rowDiv.classList.add('flex', 'border-b', 'gantt-row', 'z-10');

	rowDiv.ondrop = dropHandler;
	rowDiv.ondragover = dragoverHandler;
	rowDiv.ondragenter = dragEnter;
	rowDiv.ondragleave = dragLeave;

	const label = document.createElement('div');
	label.classList.add('w-32', 'py-1');
	label.innerText = r.worker.name;

	for (const t of r.worker.tasks) {
		const taskDiv = document.createElement('div');
		const start =
			112 +
			Math.floor(
				t.startDate.diff(gantt.horizon.start, 'hours').hours *
					gantt.pixelsPerHour,
			);
		const length = Math.floor(
			t.endDate.diff(t.startDate, 'hours').hours * gantt.pixelsPerHour,
		);

		taskDiv.style.marginLeft = `${start}px`;
		taskDiv.style.width = `${length}px`;

		taskDiv.id = `${r.worker.id}-${t.id}`;
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
		taskDiv.innerText = t.name;

		rowDiv.appendChild(taskDiv);
	}

	rowDiv.appendChild(label);
	ganttDiv.appendChild(rowDiv);
}
