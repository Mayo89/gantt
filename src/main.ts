import { Gantt } from './classes/Gantt';
import './style.css';

const gantt = new Gantt();

gantt.generateWorkers().render();

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

const ganttDiv = document.getElementById('ganttDiv') as HTMLDivElement;

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
		const start = 112 + Math.floor(t.startDate.diff(gantt.horizon.start, 'hours').hours * gantt.pixelsPerHour);
		const length = Math.floor(t.endDate.diff(t.startDate, 'hours').hours * gantt.pixelsPerHour);

		taskDiv.style.marginLeft = `${start}px`;
		taskDiv.style.width = `${length}px`;

		taskDiv.id = `${r.worker.id}-${t.id}`;
		taskDiv.ondragstart = dragstartHandler;
		taskDiv.draggable = true;

		taskDiv.classList.add('gantt-item', 'absolute', 'rounded', 'my-1', 'text-slate-900', 'hover:cursor-move');
		taskDiv.innerText = t.name;

		rowDiv.appendChild(taskDiv);
	}

	rowDiv.appendChild(label);

	ganttDiv.appendChild(rowDiv);
}

