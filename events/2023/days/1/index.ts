import fs from 'fs';
import path from 'path';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as aoc from '../../../../src/lib/utils.ts';

function isNum(char: string): boolean {
	return /[0-9]/i.test(char);
}

function part1(): number {
	const input: string = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result: number = 0;

	for (const line of input.split('\n')) {
		// For each line, turn each string into a character array
		const charArray: string[] = line.split('');

		// For each array, make a separate array only including the numbers in order
		const numArray: string[] = [];
		for (const char of charArray) {
			if (isNum(char)) {
				numArray.push(char);
			}
		}

		// Take the first and last number and combine that into a number
		const firstNum: string = numArray[0];
		const lastNum: string = numArray[numArray.length - 1];
		const combinedNum: number = parseInt(firstNum + lastNum);

		// Add that number to the total
		result += combinedNum;
	}

	return result;
}

function part2(): number {
	const input: string = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result: number = 0;

	// For each line, turn each string into a character array
	for (const line of input.split('\n')) {
		const words: string[] = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

		let replacedLine: string = '';
		for (let i = 0; i < line.length; i++) {
			if (isNum(line[i])) {
				replacedLine += line[i];
			}
			for (const word of words) {
				if (line.slice(i, i + word.length) === word) {
					replacedLine += words.indexOf(word);
					break;
				}
			}
		}

		const firstNum: string = replacedLine[0];
		const lastNum: string = replacedLine[replacedLine.length - 1];

		// Combine that into a number
		const combinedNum: number = parseInt(firstNum + lastNum);

		// Add that number to the total
		result += combinedNum;
	}

	return result;
}

export interface Solution {
	part1: () => number;
	part2: () => number;
}

export default {
	part1,
	part2,
} as Solution;
