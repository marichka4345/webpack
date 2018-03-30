import './style.scss';
import template from './template.html';

import {getName} from './typed';

const person = {
    name: 'Mariia Tretiak'
};
console.log(getName(person));

document
    .getElementById('name')
    .innerHTML = template({content: getName(person)});
