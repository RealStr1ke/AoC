import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type ExtrapolationType = 'forwards' | 'backwards';

function extrapolate(nums: number[], type: ExtrapolationType): number[] {
	if (type === 'forwards') {
		const subNums: number[][] = [nums];

		const lastSubAllZero = (): boolean => {
			return subNums[subNums.length - 1].every(num => num === 0);
		};

		while (!lastSubAllZero()) {
			// Make an array of the differences between each number of the last subNums
			const diffs: number[] = [];
			for (let i = 0; i < subNums[subNums.length - 1].length - 1; i++) {
				diffs.push(subNums[subNums.length - 1][i + 1] - subNums[subNums.length - 1][i]);
			}

			// Add the diffs to the subNums
			subNums.push(diffs);
		}

		// Predict the next number for the first subNums
		subNums[subNums.length - 1].push(0);
		for (let i = subNums.length - 2; i >= 0; i--) {
			subNums[i].push(subNums[i + 1][subNums[i + 1].length - 1] + subNums[i][subNums[i].length - 1]);
		}

		return subNums[0];
	} else if (type === 'backwards') {
		const subNums: number[][] = [nums];

		const lastSubAllZero = (): boolean => {
			return subNums[subNums.length - 1].every(num => num === 0);
		};

		while (!lastSubAllZero()) {
			// Make an array of the differences between each number of the last subNums
			const diffs: number[] = [];
			for (let i = 0; i < subNums[subNums.length - 1].length - 1; i++) {
				diffs.push(subNums[subNums.length - 1][i + 1] - subNums[subNums.length - 1][i]);
			}

			// Add the diffs to the subNums
			subNums.push(diffs);
		}

		// Predict the previous number for the first subNums
		subNums[subNums.length - 1].unshift(0);
		for (let i = subNums.length - 2; i >= 0; i--) {
			subNums[i].unshift(subNums[i][0] - subNums[i + 1][0]);
		}

		return subNums[0];
	}

	return [];
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
	const data = input;
	let result = 0;

	for (const line of data.split('\n')) {
		const nums = line.split(' ').map(Number);
		const extrapolated = extrapolate(nums, 'forwards');
		result += extrapolated[extrapolated.length - 1];
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
	const data = input;
	let result = 0;

	for (const line of data.split('\n')) {
		const nums = line.split(' ').map(Number);
		const extrapolated = extrapolate(nums, 'backwards');
		result += extrapolated[0];
	}

	return result;
}

interface Solution {
	part1: (inputSource?: string | { file: string }) => number;
	part2: (inputSource?: string | { file: string }) => number;
}

const solution: Solution = {
	part1,
	part2,
};

export default solution;
