import fs from 'fs';
import path from 'path';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as aoc from '../../../../src/lib/utils.ts';

function part1(): number {
	const input: string = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result: number = 0;

	// Parse input into array of numbers
	const numbers: string[] = input.split('\n\n');

	// Create array of total calories
	const totalCalories: number[] = [];

	// Iterate over the array of numbers, and calculate the total calories for each elf
	for (const numberGroup of numbers) {
		// Split the string into an array of numbers
		const splitNumbers: string[] = numberGroup.split('\n');

		// Calculate the total calories for the elf
		let calories: number = 0;

		for (const num of splitNumbers) {
			calories += parseInt(num);
		}

		// Add the total calories to the array
		totalCalories.push(calories);
	}

	// Find the largest element in the totalCalories array
	result = Math.max(...totalCalories);
	return result;
}

function part2(): number {
	const input: string = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result: number = 0;

	// Parse input into array of numbers
	const numbers: string[] = input.split('\n\n');

	// Create array of total calories
	const totalCalories: number[] = [];

	// Iterate over the array of numbers, and calculate the total calories for each elf
	for (const numberGroup of numbers) {
		// Split the string into an array of numbers
		const splitNumbers: string[] = numberGroup.split('\n');

		// Calculate the total calories for the elf
		let calories: number = 0;

		for (const num of splitNumbers) {
			calories += parseInt(num);
		}

		// Add the total calories to the array
		totalCalories.push(calories);
	}

	// Sort the totalCalories array in descending order and return the sum of the first three elements
	totalCalories.sort((a, b) => b - a);

	// Get the three largest elements
	const largest: number[] = totalCalories.slice(0, 3);

	// Combine the three largest elements and return the result
	result = largest[0] + largest[1] + largest[2];
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
