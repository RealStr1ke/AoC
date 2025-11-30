import fs from 'fs';
import path from 'path';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as aoc from '../../../../src/lib/utils.ts';

type Equation = [number, number[]];

function part1(inputSource?: string | { file: string }): number {
	let input: string;
	if (!inputSource) {
		input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	} else if (typeof inputSource === 'string') {
		input = inputSource;
	} else {
		input = fs.readFileSync(path.join(__dirname, inputSource.file), 'utf8');
	}
	let result: number = 0;

	const equations: Equation[] = [];
	for (const line of input.split('\n')) {
		const [testStr, numsStr] = line.split(': ').map((x) => x.split(' '));
		const test: number = parseInt(testStr[0]);
		const nums: number[] = numsStr.map((x) => parseInt(x));
		equations.push([test, nums]);
	}

	for (const equation of equations) {
		const [test, nums] = equation;
		let solved: boolean = false;

		const operators: string[] = ['+', '*'];
		const operatorCombinations: string[][] = [];
		for (let j = 0; j < operators.length ** (nums.length - 1); j++) {
			const combination: string[] = [];
			let temp: number = j;
			for (let k = 0; k < nums.length - 1; k++) {
				combination.push(operators[temp % operators.length]);
				temp = Math.floor(temp / operators.length);
			}
			operatorCombinations.push(combination);
		}

		for (const combination of operatorCombinations) {
			let value: number = nums[0];
			for (let k = 0; k < combination.length; k++) {
				const operator: string = combination[k];
				const num: number = nums[k + 1];
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

		if (solved) {
			result += test;
		}
	}

	return result;
}

function part2(inputSource?: string | { file: string }): number {
	let input: string;
	if (!inputSource) {
		input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	} else if (typeof inputSource === 'string') {
		input = inputSource;
	} else {
		input = fs.readFileSync(path.join(__dirname, inputSource.file), 'utf8');
	}
	let result: number = 0;

	const equations: Equation[] = [];
	for (const line of input.split('\n')) {
		const [testStr, numsStr] = line.split(': ').map((x) => x.split(' '));
		const test: number = parseInt(testStr[0]);
		const nums: number[] = numsStr.map((x) => parseInt(x));
		equations.push([test, nums]);
	}

	for (const equation of equations) {
		const [test, nums] = equation;
		let solved: boolean = false;

		const operators: string[] = ['+', '*', '||'];
		const operatorCombinations: string[][] = [];
		for (let j = 0; j < operators.length ** (nums.length - 1); j++) {
			const combination: string[] = [];
			let temp: number = j;
			for (let k = 0; k < nums.length - 1; k++) {
				combination.push(operators[temp % operators.length]);
				temp = Math.floor(temp / operators.length);
			}
			operatorCombinations.push(combination);
		}

		for (const combination of operatorCombinations) {
			let value: number = nums[0];
			for (let k = 0; k < combination.length; k++) {
				const operator: string = combination[k];
				const num: number = nums[k + 1];
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

		if (solved) {
			result += test;
		}
	}

	return result;
}

export interface Solution {
	part1: (inputSource?: string | { file: string }) => number;
	part2: (inputSource?: string | { file: string }) => number;
}

export default {
	part1,
	part2,
} as Solution;
