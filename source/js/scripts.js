import attachFastClick from 'fastclick';
import multiply from './components/multiply.js';

const test = document.createTextNode(multiply(4));

document.querySelector('body').appendChild(test);

//Initiate fastclick on body
attachFastClick(document.body);