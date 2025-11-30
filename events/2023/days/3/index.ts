import fs from 'fs';
import path from 'path';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as aoc from '../../../../src/lib/utils.ts';

interface NumberInfo {
	index: number;
	value: string;
}

interface DigitInfo {
	index: number;
	value: string;
}

interface SurroundingChar {
	char: string;
	index: number;
	line: number;
}

interface AdjacentAstrix {
	index: number;
	line: number;
	adjacentNums: NumberInfo[];
}

function isNum(char: string): boolean {
	return /[0-9]/.test(char);
}

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

	const text: string[] = input.split('\n');

	for (let i = 0; i < text.length; i++) {
		const line: string = text[i].trim();
		const lineChars: string[] = line.split('');

		// Get prev and next lines if they exist (if they don't, make them empty strings)
		const prevLine: string = (text[i - 1] || '').trim();
		const nextLine: string = (text[i + 1] || '').trim();

		// Find all numbers in the line (can be 1-3 digits long) and their indexes
		const digitsList: DigitInfo[] = [];
		for (let j = 0; j < line.length; j++) {
			const char: string = line[j];
			if (isNum(char)) {
				digitsList.push({ index: j, value: char });
			}
		}

		// Make sure to combine adjacent numbers and save the index of the first digit: { index: 0, value: '123' }
		const numbers: NumberInfo[] = [];
		for (let j = 0; j < digitsList.length; j++) {
			const digit: DigitInfo = digitsList[j];
			if (j === 0) {
				numbers.push({ index: digit.index, value: digit.value });
			} else if (digit.index === digitsList[j - 1].index + 1) {
				numbers[numbers.length - 1].value += digit.value;
			} else {
				numbers.push({ index: digit.index, value: digit.value });
			}
		}

		// For each number, if there are any symbols that surround it (excluding numbers and periods), including symbols on prev and next lines (diagonally too), add the number to the result
		for (const num of numbers) {
			let numStatus: boolean = false;
			const surroundingCharacters: (string | undefined)[] = [];

			// Check if there are any symbols in the surrounding characters
			surroundingCharacters.push(lineChars[num.index - 1]);
			surroundingCharacters.push(lineChars[num.index + num.value.length]);
			surroundingCharacters.push(prevLine[num.index - 1]);
			surroundingCharacters.push(prevLine[num.index + num.value.length]);
			surroundingCharacters.push(nextLine[num.index - 1]);
			surroundingCharacters.push(nextLine[num.index + num.value.length]);
			for (let k = 0; k < num.value.length; k++) {
				surroundingCharacters.push(prevLine[num.index + k]);
				surroundingCharacters.push(nextLine[num.index + k]);
			}

			for (const char of surroundingCharacters) {
				if (char && !isNum(char) && char !== '.') {
					numStatus = true;
					break;
				}
			}

			if (numStatus) {
				result += parseInt(num.value);
			}
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

	const adjacentAstrixes: AdjacentAstrix[] = []; // { index: 0, line: 0, adjacentNums: <array of nums (value and index)> }

	const text: string[] = input.split('\n');

	for (let i = 0; i < text.length; i++) {
		const line: string = text[i].trim();
		const lineChars: string[] = line.split('');

		// Get prev and next lines if they exist (if they don't, make them empty strings)
		const prevLine: string = (text[i - 1] || '').trim();
		const nextLine: string = (text[i + 1] || '').trim();

		// Find all numbers in the line (can be 1-3 digits long) and their indexes
		const digitsList: DigitInfo[] = [];
		for (let j = 0; j < line.length; j++) {
			const char: string = line[j];
			if (isNum(char)) {
				digitsList.push({ index: j, value: char });
			}
		}

		// Make sure to combine adjacent numbers and save the index of the first digit: { index: 0, value: '123' }
		const numbers: NumberInfo[] = [];
		for (let j = 0; j < digitsList.length; j++) {
			const digit: DigitInfo = digitsList[j];
			if (j === 0) {
				numbers.push({ index: digit.index, value: digit.value });
			} else if (digit.index === digitsList[j - 1].index + 1) {
				numbers[numbers.length - 1].value += digit.value;
			} else {
				numbers.push({ index: digit.index, value: digit.value });
			}
		}

		// For each number, if there are any "*" that surround it
		for (const num of numbers) {
			const surroundingCharacters: SurroundingChar[] = [];

			// Check if there are any symbols in the surrounding characters
			surroundingCharacters.push({ char: lineChars[num.index - 1], index: num.index - 1, line: i });
			surroundingCharacters.push({ char: lineChars[num.index + num.value.length], index: num.index + num.value.length, line: i });
			surroundingCharacters.push({ char: prevLine[num.index - 1], index: num.index - 1, line: i - 1 });
			surroundingCharacters.push({ char: prevLine[num.index + num.value.length], index: num.index + num.value.length, line: i - 1 });
			surroundingCharacters.push({ char: nextLine[num.index - 1], index: num.index - 1, line: i + 1 });
			surroundingCharacters.push({ char: nextLine[num.index + num.value.length], index: num.index + num.value.length, line: i + 1 });
			for (let k = 0; k < num.value.length; k++) {
				surroundingCharacters.push({ char: prevLine[num.index + k], index: num.index + k, line: i - 1 });
				surroundingCharacters.push({ char: nextLine[num.index + k], index: num.index + k, line: i + 1 });
			}

			const surroundingAstrixes: SurroundingChar[] = surroundingCharacters.filter(char => char.char === '*');

			for (const astrix of surroundingAstrixes) {
				let inMainAdjAstArr: boolean = false;
				for (const adjAstrix of adjacentAstrixes) {
					if (adjAstrix.index === astrix.index && adjAstrix.line === astrix.line) {
						inMainAdjAstArr = true;
						adjAstrix.adjacentNums.push({ index: num.index, value: num.value });
						break;
					}
				}
				if (!inMainAdjAstArr) {
					adjacentAstrixes.push({ index: astrix.index, line: astrix.line, adjacentNums: [{ index: num.index, value: num.value }] });
				}
			}
		}
	}

	// Filter to only the astrixes that have 2 adjacent numbers
	const gears: AdjacentAstrix[] = adjacentAstrixes.filter(astrix => astrix.adjacentNums.length === 2);

	// Multiply the numbers adjacent to the astrixes and add each result to the final result
	for (const gear of gears) {
		const num1: NumberInfo = gear.adjacentNums[0];
		const num2: NumberInfo = gear.adjacentNums[1];
		const gearResult: number = parseInt(num1.value) * parseInt(num2.value);
		result += gearResult;
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
