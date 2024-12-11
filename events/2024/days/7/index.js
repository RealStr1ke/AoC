import fs from 'fs';
const { re } = require('mathjs');
import path from 'path';

function part1() {
	const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result = 0;

	const equations = [];
	for (const line of data.split('\n')) {
		let [test, nums] = line.split(': ').map((x) => x.split(' '));
		test = parseInt(test[0]);
		nums = nums.map((x) => parseInt(x));
		equations.push([test, nums]);
	}

	for (let i = 0; i < equations.length; i++) {
		const equation = equations[i];
		const [test, nums] = equation;
		let solved = false;

		const operators = ['+', '*'];
		const operatorCombinations = [];
		for (let j = 0; j < operators.length ** (nums.length - 1); j++) {
			const combination = [];
			let temp = j;
			for (let k = 0; k < nums.length - 1; k++) {
				combination.push(operators[temp % operators.length]);
				temp = Math.floor(temp / operators.length);
			}
			operatorCombinations.push(combination);
		}

		for (let j = 0; j < operatorCombinations.length; j++) {
			const combination = operatorCombinations[j];
			let value = nums[0];
			for (let k = 0; k < combination.length; k++) {
				const operator = combination[k];
				const num = nums[k + 1];
				if (operator === '+') {
					value += num;
				} else if (operator === '*') {
					value *= num;
				}
			}
			if (value === test) {
				solved = true;
				break;
			}
		}

		if (!solved) {
			// console.log(`${i + 1} is unsolved`, equation);
		} else {
			// console.log(`${i + 1} is solved`, equation);
			result += test;
		}

	}


	return result;
}

function part2() {
	const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result = 0;

	const equations = [];
	for (const line of data.split('\n')) {
		let [test, nums] = line.split(': ').map((x) => x.split(' '));
		test = parseInt(test[0]);
		nums = nums.map((x) => parseInt(x));
		equations.push([test, nums]);
	}


	for (let i = 0; i < equations.length; i++) {
		const equation = equations[i];
		const [test, nums] = equation;
		let solved = false;

		const operators = ['+', '*', '||'];
		const operatorCombinations = [];
		for (let j = 0; j < operators.length ** (nums.length - 1); j++) {
			const combination = [];
			let temp = j;
			for (let k = 0; k < nums.length - 1; k++) {
				combination.push(operators[temp % operators.length]);
				temp = Math.floor(temp / operators.length);
			}
			operatorCombinations.push(combination);
		}

		for (let j = 0; j < operatorCombinations.length; j++) {
			const combination = operatorCombinations[j];
			let value = nums[0];
			for (let k = 0; k < combination.length; k++) {
				const operator = combination[k];
				const num = nums[k + 1];
				if (operator === '+') {
					value += num;
				} else if (operator === '*') {
					value *= num;
				} else if (operator === '||') {
					value = parseInt(`${value}${num}`);
				}
			}
			if (value === test) {
				solved = true;
				break;
			}
		}

		if (!solved) {
			// console.log(`${i + 1} is unsolved`, equation);
		} else {
			// console.log(`${i + 1} is solved`, equation);
			result += test;
		}

	}


	return result;
}

// console.log(`Part 1: ${part1()}`);
// console.log(`Part 2: ${part2()}`);

export default {
	part1,
	part2,
};