import fs from 'fs';
import path from 'path';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as aoc from '../../../../src/lib/utils.ts';

function score(elf: string, you: string): number {
	// For elf: A is Rock, B is Paper, C is Scissors
	// For you: X is Rock, Y is Paper, Z is Scissors
	const combined: string = elf + you;
	let yourScore: number = 0;
	switch (combined) {
		case 'AX':
		case 'BY':
		case 'CZ':
			yourScore += 3; break;
		case 'AY':
		case 'BZ':
		case 'CX':
			yourScore += 6; break;
		case 'AZ':
		case 'BX':
		case 'CY':
			yourScore += 0; break;
	}

	switch (you) {
		case 'X':
			yourScore += 1;
			break;
		case 'Y':
			yourScore += 2;
			break;
		case 'Z':
			yourScore += 3;
			break;
	}

	return yourScore;
}

function solve2(elf: string, outcome: string): string {
	// For elf: A is Rock, B is Paper, C is Scissors
	// For you: X is Rock, Y is Paper, Z is Scissors
	// For outcome: X is a loss for you, Y is a draw, Z is a win for you

	let yourMove: string = '';
	switch (outcome) {
		case 'X':
			switch (elf) {
				case 'A':
					yourMove = 'Z';
					break;
				case 'B':
					yourMove = 'X';
					break;
				case 'C':
					yourMove = 'Y';
					break;
			}
			break;
		case 'Y':
			switch (elf) {
				case 'A':
					yourMove = 'X';
					break;
				case 'B':
					yourMove = 'Y';
					break;
				case 'C':
					yourMove = 'Z';
					break;
			}
			break;
		case 'Z':
			switch (elf) {
				case 'A':
					yourMove = 'Y';
					break;
				case 'B':
					yourMove = 'Z';
					break;
				case 'C':
					yourMove = 'X';
					break;
			}
			break;
	}

	return yourMove;
}

function part1(): number {
	const input: string = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result: number = 0;

	// Read input file
	const strategy: string[] = input.split('\n');

	let yourScore: number = 0;
	for (const line of strategy) {
		const elf: string = line.split(' ')[0];
		const you: string = line.split(' ')[1];
		const gameScore: number = score(elf, you);
		yourScore += gameScore;
	}

	result = yourScore;
	return result;
}

function part2(): number {
	const input: string = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result: number = 0;

	// Read input file
	const strategy: string[] = input.split('\n');

	let yourScore: number = 0;
	for (const line of strategy) {
		const elf: string = line.split(' ')[0];
		const outcome: string = line.split(' ')[1];
		const you: string = solve2(elf, outcome);
		const gameScore: number = score(elf, you);
		yourScore += gameScore;
	}

	result = yourScore;
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
