// Advent of Code 2022, Day 1
// https://adventofcode.com/2022/day/1
// Author: @RealStr1ke

// Part 1

function part1() {
	// Get required modules
	import fs from 'fs';
	import path from 'path';

	// Read input file
	const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');

	// Parse input into array of numbers
	const numbers = input.split('\n\n');

	// Create array of total calories
	const totalCalories = [];

	// Iterate over the array of numbers, and calculate the total calories for each elf
	for (let i = 0; i < numbers.length; i++) {
		// Split the string into an array of numbers
		const splitNumbers = numbers[i].split('\n');

		// Calculate the total calories for the elf
		let calories = 0;

		for (let j = 0; j < splitNumbers.length; j++) {
			calories += parseInt(splitNumbers[j]);
		}

		// Add the total calories to the array
		totalCalories.push(calories);
	}

	// Find the largest element in the totalCalories array
	let largest;
	for (let i = 0; i < totalCalories.length; i++) {
		if (largest === undefined || totalCalories[i] > largest) {
			largest = totalCalories[i];
		}
	}

	return largest;
}

// Part 2
function part2() {
	// Get required modules
	import fs from 'fs';
	import path from 'path';

	// Read input file
	const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');

	// Parse input into array of numbers
	const numbers = input.split('\n\n');

	// Create array of total calories
	const totalCalories = [];

	// Iterate over the array of numbers, and calculate the total calories for each elf
	for (let i = 0; i < numbers.length; i++) {
		// Split the string into an array of numbers
		const splitNumbers = numbers[i].split('\n');

		// Calculate the total calories for the elf
		let calories = 0;

		for (let j = 0; j < splitNumbers.length; j++) {
			calories += parseInt(splitNumbers[j]);
		}

		// Add the total calories to the array
		totalCalories.push(calories);
	}

	// Sort the totalCalories array in descending order and return the sum of the first three elements
	totalCalories.sort((a, b) => b - a);

	// Get the three largest elements
	const largest = totalCalories.slice(0, 3);

	// Combine the three largest elements and return the result
	console.log(largest);
	return largest[0] + largest[1] + largest[2];
}

console.log('Part 1 Result: ' + part1());
console.log('Part 2 Result: ' + part2());