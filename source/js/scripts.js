import multiply from './components/multiply.js';

const test = document.createTextNode(multiply(5));

document.querySelector('body').appendChild(test);