import fs from 'fs';
import path from 'path';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as aoc from '../../../../src/lib/utils.ts';

/**
 * Solution I found for Part 2: || Don't brute force this if you have any sort of empathy for your CPU lol, the numbers blow up pretty quickly. Basically what I did was instead of having an array/list of all the rocks as shown in the input, I made an object/json where the keys were the numbers that are on the rocks and the values were how many rocks had that number. Using that, with each iteration you can create a new object based on the one you had previously using the rules:
 * - For n stones with the number 0, add n stones to the count of stones with the number 1.
 * - For n stones with even length, split the number in half and add n stones to the count of stones with each half.
 * - For n stones that don't follow those rules, add n stones to the count of stones with the number of the original stone multiplied by 2024.
 * This approach optimizes the process by reducing the complexity from handling individual stones to managing counts of each unique stone value, thereby preventing the exponential growth of the stone list.
 */
function blink(stones: number[], iterations: number): number {
	// An object to store the count of each stone value. Changes each iteration.
	let stonesObj: Record<string, number> = {};

	// The cache that stores the transformed values of each stone. Used to optimize the process.
	const cache: Record<string, number | number[]> = {};

	// Initialize the stones object with the initial stone counts.
	for (const stone of stones) {
		const stoneKey: string = stone.toString();
		if (!stonesObj[stoneKey]) stonesObj[stoneKey] = 0;
		stonesObj[stoneKey]++;
	}

	// Perform the specified number of iterations.
	for (let i = 0; i < iterations; i++) {
		// Create a blank object to store the new stone counts.
		const newStonesObj: Record<string, number> = {};

		// Check each stone in the current object (checks the keys of the object)
		for (const stone of Object.keys(stonesObj)) {
			// Get the count of the current stone.
			const currentCount: number = stonesObj[stone];

			// If the stone hasn't been cached yet, cache it.
			if (!cache[stone]) {
				if (stone === '0') {
					cache[stone] = 1;
				} else if (stone.length % 2 === 0) {
					const half: number = stone.length / 2;
					cache[stone] = [parseInt(stone.slice(0, half)), parseInt(stone.slice(half))];
				} else {
					cache[stone] = parseInt(stone) * 2024;
				}
			}

			// Add the transformed stones to the new object.
			if (stone.length % 2 === 0) {
				const cachedValue = cache[stone] as number[];
				// If either of the two halves aren't in the new object, add them.
				if (!newStonesObj[cachedValue[0]]) newStonesObj[cachedValue[0]] = 0;
				if (!newStonesObj[cachedValue[1]]) newStonesObj[cachedValue[1]] = 0;

				// Add the current count to both halves.
				newStonesObj[cachedValue[0]] += currentCount;
				newStonesObj[cachedValue[1]] += currentCount;
			} else {
				const cachedValue = cache[stone] as number;
				// If the transformed stone isn't in the new object, add it.
				if (!newStonesObj[cachedValue]) newStonesObj[cachedValue] = 0;

				// Add the current count to the transformed stone.
				newStonesObj[cachedValue] += currentCount;
			}

			// Probably not necessary, but any stones in newStonesObj with a count of 0 are removed here
			for (const s in newStonesObj) {
				if (newStonesObj[s] === 0) {
					// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
					delete newStonesObj[s];
				}
			}
		}

		// After iterating through all stones, the new object is saved to the actual stones object.
		stonesObj = newStonesObj;
	}

	// After all iterations, for each stone in the object (checking object keys), add its count to the total stone count.
	let stoneCount: number = 0;
	for (const s of Object.keys(stonesObj)) {
		stoneCount += stonesObj[s];
	}

	return stoneCount;
}

function part1(): number {
	const input: string = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result: number = 0;

	let stones: number[] = [];
	for (const line of input.split('\n')) {
		stones = line.split(' ').map(Number);
	}

	const stoneCount: number = blink(stones, 25);

	result = stoneCount;
	return result;
}

function part2(): number {
	const input: string = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result: number = 0;

	let stones: number[] = [];
	for (const line of input.split('\n')) {
		stones = line.split(' ').map(Number);
	}

	const stoneCount: number = blink(stones, 75);

	result = stoneCount;
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
