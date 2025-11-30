import fs from 'fs';
import path from 'path';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as aoc from '../../../../src/lib/utils.ts';

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

	const originalGrid: string[][] = [];

	for (const line of input.split('\n')) {
		const row: string[] = [];
		for (const char of line) {
			row.push(char);
		}
		originalGrid.push(row);
	}

	// Horizontal
	const horizontal: string[] = [];
	for (const row of originalGrid) {
		horizontal.push(row.join(''));
	}

	// Vertical
	const vertical: string[] = [];
	for (let i = 0; i < originalGrid[0].length; i++) {
		const column: string[] = [];
		for (let j = 0; j < originalGrid.length; j++) {
			column.push(originalGrid[j][i]);
		}
		vertical.push(column.join(''));
	}

	// Diagonal (top left to bottom right)
	const diagonalTL: string[] = [];
	for (let k = 0; k < originalGrid.length * 2 - 1; k++) {
		const diagonal: string[] = [];
		for (let j = 0; j <= k; j++) {
			const i: number = k - j;
			if (i < originalGrid.length && j < originalGrid.length) {
				diagonal.push(originalGrid[i][j]);
			}
		}
		diagonalTL.push(diagonal.join(''));
	}

	// Diagonal (top right to bottom left)
	const diagonalTR: string[] = [];
	for (let k = 0; k < originalGrid.length * 2 - 1; k++) {
		const diagonal: string[] = [];
		for (let j = 0; j <= k; j++) {
			const i: number = k - j;
			if (i < originalGrid.length && j < originalGrid.length) {
				diagonal.push(originalGrid[i][originalGrid.length - j - 1]);
			}
		}
		diagonalTR.push(diagonal.join(''));
	}

	// Add a duplicate of all the lines but in reverse
	const horizontalReversed: string[] = [];
	for (const row of horizontal) horizontalReversed.push(row.split('').reverse().join(''));
	horizontal.push(...horizontalReversed);

	const verticalReversed: string[] = [];
	for (const row of vertical) verticalReversed.push(row.split('').reverse().join(''));
	vertical.push(...verticalReversed);

	const diagonalTLReversed: string[] = [];
	for (const row of diagonalTL) diagonalTLReversed.push(row.split('').reverse().join(''));
	diagonalTL.push(...diagonalTLReversed);

	const diagonalTRReversed: string[] = [];
	for (const row of diagonalTR) diagonalTRReversed.push(row.split('').reverse().join(''));
	diagonalTR.push(...diagonalTRReversed);

	const regex: string = 'XMAS';

	let horizontalCount: number = 0;
	let verticalCount: number = 0;
	let diagonalTLCount: number = 0;
	let diagonalTRCount: number = 0;

	for (const row of horizontal) {
		const matches: RegExpMatchArray | null = row.match(new RegExp(regex, 'g'));
		if (matches) {
			horizontalCount += matches.length;
		}
	}

	for (const row of vertical) {
		const matches: RegExpMatchArray | null = row.match(new RegExp(regex, 'g'));
		if (matches) {
			verticalCount += matches.length;
		}
	}

	for (const row of diagonalTL) {
		const matches: RegExpMatchArray | null = row.match(new RegExp(regex, 'g'));
		if (matches) {
			diagonalTLCount += matches.length;
		}
	}

	for (const row of diagonalTR) {
		const matches: RegExpMatchArray | null = row.match(new RegExp(regex, 'g'));
		if (matches) {
			diagonalTRCount += matches.length;
		}
	}

	result = horizontalCount + verticalCount + diagonalTLCount + diagonalTRCount;

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

	const originalGrid: string[][] = [];

	for (const line of input.split('\n')) {
		const row: string[] = [];
		for (const char of line) {
			row.push(char);
		}
		originalGrid.push(row);
	}

	const threeByThrees: string[][][] = [];

	for (let i = 0; i < originalGrid.length; i++) {
		if (originalGrid[i + 1] && originalGrid[i + 2]) {
			for (let j = 0; j < originalGrid[i].length; j++) {
				if (originalGrid[i][j + 1] && originalGrid[i][j + 2]) {
					const threeByThree: string[][] = [
						[originalGrid[i][j], originalGrid[i][j + 1], originalGrid[i][j + 2]],
						[originalGrid[i + 1][j], originalGrid[i + 1][j + 1], originalGrid[i + 1][j + 2]],
						[originalGrid[i + 2][j], originalGrid[i + 2][j + 1], originalGrid[i + 2][j + 2]],
					];
					threeByThrees.push(threeByThree);
				}
			}
		}
	}

	const nines: string[] = [];
	for (const threeByThree of threeByThrees) {
		const nine: string = threeByThree.flat().join('');
		nines.push(nine);
	}

	for (const nine of nines) {
		let nA: string[] = nine.split(''); // nineArray
		nA = [nA[0], nA[2], nA[4], nA[6], nA[8]];
		if (nA[0] === 'M' && nA[1] === 'S' && nA[2] === 'A' && nA[3] === 'M' && nA[4] === 'S') {
			result++;
		} else if (nA[0] === 'M' && nA[1] === 'M' && nA[2] === 'A' && nA[3] === 'S' && nA[4] === 'S') {
			result++;
		} else if (nA[0] === 'S' && nA[1] === 'S' && nA[2] === 'A' && nA[3] === 'M' && nA[4] === 'M') {
			result++;
		} else if (nA[0] === 'S' && nA[1] === 'M' && nA[2] === 'A' && nA[3] === 'S' && nA[4] === 'M') {
			result++;
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
