import '../../node_modules/babel-polyfill/dist/polyfill';
import multiply from './components/multiply.js';
const test = document.createTextNode(multiply(5));

document.querySelector('body').appendChild(test);

const testArray = [1, 2, 3, 4];

for(const test of testArray) {
  /*eslint-disable */
  console.log(test);
  /*eslint-enable */
}