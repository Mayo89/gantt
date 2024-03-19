import { Gantt } from './classes/Gantt';
import './classes/events/Clicking';
import './style.css';

const gantt = new Gantt();

gantt.generateWorkers().render();
