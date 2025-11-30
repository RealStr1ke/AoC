import fs from 'fs';
import path from 'path';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as aoc from '../../../../src/lib/utils.ts';

function checkUpdate(update: number[], rules: number[][]): boolean {
	for (const rule of rules) {
		if (update.includes(rule[0]) && update.includes(rule[1])) {
			const index1: number = update.indexOf(rule[0]);
			const index2: number = update.indexOf(rule[1]);

			if (index1 > index2) return false;
		}
	}

	return true;
}

function reorderUpdate(update: number[], rules: number[][]): number[] {
	if (checkUpdate(update, rules)) return update;

	let newUpdate: number[] = [];

	for (let i = 0; i < update.length; i++) {
		if (i === 0) {
			newUpdate.push(update[i]);
		} else {
			for (let j = 0; j <= newUpdate.length; j++) {
				const tempUpdate: number[] = newUpdate.slice();
				tempUpdate.splice(j, 0, update[i]);

				const status: boolean = checkUpdate(tempUpdate, rules);
				if (status) {
					newUpdate = tempUpdate;
					break;
				}
			}
		}
	}
	return newUpdate;
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

	const [rulesString, updatesString] = input.split('\n\n').map(x => x.split('\n'));
	const rules: number[][] = [];
	const updates: number[][] = [];

	for (const rule of rulesString) {
		const [num1, num2] = rule.split('|').map(Number);
		rules.push([num1, num2]);
	}
	
	for (const update of updatesString) {
		updates.push(update.split(',').map(Number));
	}

	for (const update of updates) {
		const status: boolean = checkUpdate(update, rules);
		if (status) result += update[Math.floor(update.length / 2)];
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

	const [rulesString, updatesString] = input.split('\n\n').map(x => x.split('\n'));
	const rules: number[][] = [];
	const updates: number[][] = [];

	for (const rule of rulesString) {
		const [num1, num2] = rule.split('|').map(Number);
		rules.push([num1, num2]);
	}
	
	for (const update of updatesString) {
		updates.push(update.split(',').map(Number));
	}

	for (const update of updates) {
		const status: boolean = checkUpdate(update, rules);
		if (!status) {
			const newUpdate: number[] = reorderUpdate(update, rules);
			result += newUpdate[Math.floor(newUpdate.length / 2)];
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
