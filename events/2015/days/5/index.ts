import fs from 'fs';
import path from 'path';
import * as aoc from '../../../../src/lib/utils.ts';

function part1(): number {
	const input: string = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');

	let result: number = 0;

	const data: string[] = aoc.createArray(input, '\n');

	for (const line of data) {
		// Check for at least one pair of repeated letters
		const containsDoubles = /(.)\1/.test(line);

		// Check if it has at least 3 vowels
		const hasThreeVowels = (line.match(/[aeiou]/g) || []).length >= 3;

		// Check if it doesn't contain forbidden strings
		const noForbiddenStrings = !['ab', 'cd', 'pq', 'xy'].some(str => line.includes(str));

		if (!containsDoubles || !hasThreeVowels || !noForbiddenStrings) continue;
		result++;
	}

	return result;
}

function part2(): number {
	const input: string = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');

	let result: number = 0;

	const data: string[] = aoc.createArray(input, '\n');

	for (const line of data) {
		let hasPair = false;
		let hasRepeats = false;

		const chars = line.split('');

		// Check for a pair of any two letters that appears at least twice in the string without overlapping
		const rawPairs: string[] = [];
		for (let i = 0; i < chars.length - 1; i++) {
			const pair = chars[i] + chars[i + 1];
			rawPairs.push(pair);
		}

		for (let i = 0; i < rawPairs.length; i++) {
			const currentPair = rawPairs[i];
			for (let j = i + 1; j < rawPairs.length; j++) {
				if (rawPairs[j] === currentPair && j !== i + 1) {
					hasPair = true;
					break;
				}
			}
			if (hasPair) break;
		}

		// Check for a letter that repeats with exactly one letter between them
		for (let i = 0; i < chars.length - 2; i++) {
			if (chars[i] === chars[i + 2]) {
				hasRepeats = true;
			}
		}

		if (!hasPair || !hasRepeats) continue;
		result++;
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