import { Gantt } from './classes/Gantt';
import { Task } from './classes/Task';
import { GanttWorker } from './classes/Worker';
import './style.css';

const gantt = new Gantt();

for (let i = 1; i <= 100; i++) {
	const worker = new GanttWorker(`worker-${i}`);
	worker.addTask(new Task(`Task ${i}`));
	gantt.addWorker(worker);
}

const app = document.getElementById('app');
const dateDiv = document.getElementsByClassName('dates')[0];

const yearRow = document.createElement('div');
yearRow.classList.add('border-y');

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
let yearWidth = 0;
const ganttWidth = gantt.horizon.hours() * gantt.pixelsPerHour - 112;
const ganttHeight = 100 * 28.8;

const ganttDiv = document.getElementById('ganttDiv') as HTMLDivElement;
const ganttCanvas = document.getElementById('ganttCanvas') as HTMLCanvasElement;

ganttCanvas.style.width = `${ganttWidth}px`;
ganttCanvas.style.height = `${ganttHeight}px`;
// Set actual size in memory (scaled to account for extra pixel density).
const scale = window.devicePixelRatio; // Change to 1 on retina screens to see blrry canvas.
ganttCanvas.width = Math.floor(ganttWidth * scale);
ganttCanvas.height = Math.floor(ganttHeight * scale);

const ctx = ganttCanvas.getContext('2d') as CanvasRenderingContext2D;

// Normalize coordinate system to use CSS pixels.
ctx.scale(scale, scale);
ctx.strokeStyle = 'white';

let currentX = -0.5;

for (let i = 0; i < gantt.horizon.hours(); i++) {
	const newDate = gantt.horizon.start.plus({ hours: i });

	if (!previousDate) {
		previousDate = newDate;
		continue;
	}

	if (previousDate.year !== newDate.year) {
		const yearDiv = document.createElement('div');
		yearDiv.innerText = previousDate.year.toString();
		yearDiv.classList.add('border-l', 'py-1');
		yearDiv.style.width = `${yearWidth}px`;
		yearRow.appendChild(yearDiv);
		yearWidth = 0;
	}

	if (previousDate.month !== newDate.month) {
		const monthDiv = document.createElement('div');
		monthDiv.innerText = previousDate.monthLong;
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
	yearWidth += gantt.pixelsPerHour;
	previousDate = newDate;
}

dateDiv?.appendChild(yearRow);
dateDiv?.appendChild(monthRow);
dateDiv?.appendChild(weekRow);
dateDiv?.appendChild(dayRow);

if (gantt.pixelsPerHour >= 24) {
	dateDiv?.appendChild(hourRow);
}

gantt.rows.forEach((r) => {
	const rowDiv = document.createElement('div');
	rowDiv.classList.add('flex', 'border-b', 'ganttRow', 'z-10');

	const label = document.createElement('div');
	label.classList.add('w-32', 'py-2');
	label.innerText = r.worker.name;

	const tasksContainer = document.createElement('div');
	tasksContainer.classList.add('flex', 'flex-grow');

	r.worker.tasks.forEach((t) => {
		const taskDiv = document.createElement('div');
		taskDiv.classList.add(
			'w-16',
			'border',
			'rounded',
			'my-1',
			'bg-cyan-400',
			'hover:animate-pulse',
			'hover:cursor-move'
		);
		taskDiv.innerText = t.name;

		tasksContainer.appendChild(taskDiv);
	});

	rowDiv.appendChild(label);
	rowDiv.appendChild(tasksContainer);
	ganttDiv.appendChild(rowDiv);
});
