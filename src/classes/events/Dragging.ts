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

export { dragEnter, dragLeave, dragoverHandler, dragstartHandler, dropHandler };
