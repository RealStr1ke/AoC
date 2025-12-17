import fs from 'fs';
import path from 'path';
import * as aoc from '../../../../src/lib/utils.ts';

function part1(inputSource?: string | { file: string }): number {
	// Handle different input sources for testing
	let input: string;
	if (!inputSource) {
		input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	} else if (typeof inputSource === 'string') {
		input = inputSource;
	} else {
		input = fs.readFileSync(path.join(__dirname, inputSource.file), 'utf8');
	}

	let result: number = 0;
	const data: string[] = aoc.createArray(input, '\n');
	const rawData: string[][] = [];
	for (let i = 0; i < data.length; i++) {
		const line: string = data[i];
		const row: string[] = line.split('');
		let currentChars: string[] = [];
		const values: string[] = [];
		for (const char of row) {
			if (char === ' ') {
				if (currentChars.length > 0) {
					const value = currentChars.join('');
					values.push(value);
					currentChars = [];
				}
			} else {
				currentChars.push(char);
			}
		}
		if (currentChars.length > 0) {
			const value = currentChars.join('');
			values.push(value);
		}
		rawData.push(values);
	}

	
	for (let i = 0; i < rawData[rawData.length - 1].length; i++) {
		const operator = rawData[rawData.length - 1][i];
		const operands: number[] = [];
		for (let j = 0; j < rawData.length - 1; j++) {
			const value = parseInt(rawData[j][i], 10);
			operands.push(value);
		}
		// console.log(`Operator: ${operator}, Operands: ${operands.join(', ')}`);
		
		// Perform operation based on operator
		let operationResult: number = 0;
		if (operator === '+') {
			operationResult = operands.reduce((a, b) => a + b, 0);
		} else if (operator === '*') {
			operationResult = operands.reduce((a, b) => a * b, 1);
		} else {
			throw new Error(`Unknown operator (tf?): ${operator}`);
		}

		result += operationResult;
	}


	return result;
}

function part2(inputSource?: string | { file: string }): number {
	// Handle different input sources for testing
	let input: string;
	if (!inputSource) {
		input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	} else if (typeof inputSource === 'string') {
		input = inputSource;
	} else {
		input = fs.readFileSync(path.join(__dirname, inputSource.file), 'utf8');
	}

	let result: number = 0;
	const data: string[] = aoc.createArray(input, '\n');

	const longestLineLength: number = Math.max(...data.map(line => line.length));
	for (let i = 0; i < data.length; i++) {
		while (data[i].length < longestLineLength) {
			data[i] += ' ';
		}
	}

	const performOperation = (operator: string, startIndex: number, length: number): number => {
		const operands: number[] = [];
		for (let j = startIndex; j < startIndex + length; j++) {
			const value = parseInt(`${data[0][j]}${data[1][j]}${data[2][j]}${data[3][j]}`);
			operands.push(value);
		}
		
		if (operator === '+') {
			return operands.reduce((a, b) => a + b, 0);
		} else if (operator === '*') {
			return operands.reduce((a, b) => a * b, 1);
		} else {
			throw new Error(`Unknown operator (tf?): ${operator}`);
		}
	};

	let currentOperator: string = '';
	let currentOperatorIndex: number = -1;
	let currentOperationLength: number = 0;

	for (let i = 0; i < longestLineLength; i++) {
		const char = data[data.length - 1][i];
		const isOperator = char === '+' || char === '*';
		if (isOperator) {
			if (i > 0) result += performOperation(currentOperator, currentOperatorIndex, currentOperationLength);
			currentOperator = char;
			currentOperatorIndex = i;
			currentOperationLength = 0;
		} else {
			currentOperationLength++;
		}
	}

	result += performOperation(currentOperator, currentOperatorIndex, currentOperationLength + 1);


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