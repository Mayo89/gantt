import { Gantt } from './classes/Gantt';
import { Task } from './classes/Task';
import { GanttWorker } from './classes/Worker';
import './style.css';

const gantt = new Gantt();
const worker = new GanttWorker('test 1');
worker.addTask(new Task('Task 1'));
gantt.addWorker(worker);

const app = document.getElementById('app');
const dateDiv = document.getElementsByClassName('dates')[0];

const yearRow = document.createElement('div');
yearRow.classList.add('border-t');

const monthRow = document.createElement('div');
monthRow.classList.add('flex', 'flex-row', 'border-t');

const weekRow = document.createElement('div');
weekRow.classList.add('flex', 'flex-row', 'border-t');

const dayRow = document.createElement('div');
dayRow.classList.add('flex', 'flex-row', 'border-y');

const hourRow = document.createElement('div');
hourRow.classList.add('flex', 'flex-row', 'border-b');
let previousDate = null;
let dayWidth = gantt.pixelsPerHour;
let weekWidth = gantt.pixelsPerHour;
let monthWidth = gantt.pixelsPerHour;
let yearWidth = 0;

for (let i = 0; i < gantt.horizon.hours(); i++) {
	const newDate = gantt.horizon.start.plus({ hours: i });

	if (previousDate) {
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
			const dayDiv = document.createElement('div');
			dayDiv.innerText = previousDate.day.toString();
			dayDiv.classList.add('border-l', 'py-1');
			dayDiv.style.width = `${dayWidth}px`;
			dayRow.appendChild(dayDiv);
			dayWidth = 0;
		}
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

const labels = document.getElementsByClassName('labels')[0];

gantt.rows.forEach((r) => {
	const label = document.createElement('div');
	label.innerText = r.worker.name;
	labels.appendChild(label);
});
