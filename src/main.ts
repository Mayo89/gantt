import { generateWorkers } from './classes/DataGen';
import { Gantt } from './classes/Gantt';
import './classes/events/Clicking';
import './style.css';

const gantt = new Gantt();

gantt.addWorkerRows(generateWorkers(gantt)).render();
