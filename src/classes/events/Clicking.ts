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
