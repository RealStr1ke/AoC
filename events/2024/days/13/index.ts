import fs from 'fs';
import path from 'path';
import * as aoc from '../../../../src/lib/utils.ts';

interface MachineData {
	buttonA: { x: number; y: number };
	buttonB: { x: number; y: number };
	prize: { x: number; y: number };
};

function findCheapestWay(machine: MachineData): { a: number; b: number } {
	// Since they didn't let me brute force for part 2 :(, I went to google before realizing it was just goofy linear algebra
	// It's just a systems of equations lol so I just did threw a quick substitution together and turned it to code
	// Equations:
	// buttonA.x * a + buttonB.x * b = prize.x  (1)
	// buttonA.y * a + buttonB.y * b = prize.y  (2)

	const buttonA = machine.buttonA;
	const buttonB = machine.buttonB;
	const prize = machine.prize;

	// Find b
	const b = (buttonA.y * prize.x - buttonA.x * prize.y) /
             (buttonA.y * buttonB.x - buttonA.x * buttonB.y);

	// Substitute back to find a
	const a = (prize.x - machine.buttonB.x * b) / machine.buttonA.x;

	// Check if solution exists and is non-negative
	if (Math.floor(a) === a && Math.floor(b) === b && a >= 0 && b >= 0) {
		return { a, b };
	}

	return { a: 0, b: 0 }; // No solution :(
}

function part1(): number {
	const input: string = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result: number = 0;

	const data: string[] = aoc.createArray(input, '\n\n');
	const machines: MachineData[] = [];
	for (const machine of data) {
		const lines: string[] = aoc.createArray(machine, '\n');
		const buttonARegex = /Button A: X\+(\d+), Y\+(\d+)/;
		const buttonBRegex = /Button B: X\+(\d+), Y\+(\d+)/;
		const prizeRegex = /Prize: X=(\d+), Y=(\d+)/;

		const buttonAExec = buttonARegex.exec(lines[0]);
		const buttonBExec = buttonBRegex.exec(lines[1]);
		const prizeExec = prizeRegex.exec(lines[2]);

		if (!buttonAExec || !buttonBExec || !prizeExec) {
			throw new Error('Invalid input format');
		}

		const machineData = {
			buttonA: {
				x: parseInt(buttonAExec[1]),
				y: parseInt(buttonAExec[2]),
			},
			buttonB: {
				x: parseInt(buttonBExec[1]),
				y: parseInt(buttonBExec[2]),
			},
			prize: {
				x: parseInt(prizeExec[1]),
				y: parseInt(prizeExec[2]),
			},
		};

		machines.push(machineData);
	}

	for (const machine of machines) {
		const cheapestWay = findCheapestWay(machine);
		// console.log(cheapestWay);
		// Cost for A: 3 tokens, cost for B: 1 token
		const totalCost = 3 * cheapestWay.a + cheapestWay.b;
		result += totalCost;
	}

	return result;
}

function part2(): number {
	const input: string = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result: number = 0;

	const data: string[] = aoc.createArray(input, '\n\n');
	const machines: MachineData[] = [];
	for (const machine of data) {
		const lines: string[] = aoc.createArray(machine, '\n');
		const buttonARegex = /Button A: X\+(\d+), Y\+(\d+)/;
		const buttonBRegex = /Button B: X\+(\d+), Y\+(\d+)/;
		const prizeRegex = /Prize: X=(\d+), Y=(\d+)/;

		const buttonAExec = buttonARegex.exec(lines[0]);
		const buttonBExec = buttonBRegex.exec(lines[1]);
		const prizeExec = prizeRegex.exec(lines[2]);

		if (!buttonAExec || !buttonBExec || !prizeExec) {
			throw new Error('Invalid input format');
		}

		const machineData = {
			buttonA: {
				x: parseInt(buttonAExec[1]),
				y: parseInt(buttonAExec[2]),
			},
			buttonB: {
				x: parseInt(buttonBExec[1]),
				y: parseInt(buttonBExec[2]),
			},
			prize: {
				x: parseInt(prizeExec[1]) + 10000000000000,
				y: parseInt(prizeExec[2]) + 10000000000000,
			},
		};

		machines.push(machineData);
	}

	for (const machine of machines) {
		const cheapestWay = findCheapestWay(machine);
		// Cost for A: 3 tokens, cost for B: 1 token
		const totalCost = 3 * cheapestWay.a + cheapestWay.b;
		result += totalCost;
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