import fs from 'fs';
import path from 'path';
import * as aoc from '../../../../src/lib/utils.ts';

interface Machine {
	diagram: boolean[];
	buttons: number[][];
	joltage: number[];
}

// just brute force w/ GF(2) for part 1 (since pressing a button twice is the same as not pressing it)
// i'll maybe redo it with gaussian elimination some other time
function findMinPressesForDiagram(diagram: boolean[], buttons: number[][]): number {
	const numLights = diagram.length;
	const numButtons = buttons.length;
	let minPresses = Infinity;
	
	// 2^numButtons combinations
	for (let mask = 0; mask < (1 << numButtons); mask++) {
		const lights = new Array(numLights).fill(false);
		let presses = 0;

		// Apply button presses according to mask
		for (let i = 0; i < numButtons; i++) {
			if (mask & (1 << i)) {
				presses++;

				for (const lightIdx of buttons[i]) {
					lights[lightIdx] = !lights[lightIdx];
				}
			}
		}
		
		// Check if final state matches target diagram
		let matches = true;
		for (let i = 0; i < numLights; i++) {
			if (lights[i] !== diagram[i]) {
				matches = false;
				break;
			}
		}
		
		if (matches) {
			minPresses = Math.min(minPresses, presses);
		}
	}
	
	return minPresses === Infinity ? -1 : minPresses;
}

// freaky matrix math for part 2
function findMinPressesForJoltage(joltage: number[], buttons: number[][]): number {
	const numCounters = joltage.length;
	const numButtons = buttons.length;
	
	// Build coefficient matrix and calculate upper bounds for each button
	const matrix: number[][] = Array.from({ length: numCounters }, () => new Array(numButtons).fill(0));
	const bounds = new Array(numButtons).fill(Infinity);
	
	for (let j = 0; j < numButtons; j++) {
		const wiring = buttons[j];
		if (wiring && wiring.length > 0) {
			for (const counterIdx of wiring) {
				if (counterIdx < numCounters) {
					matrix[counterIdx][j] = 1;
					if (joltage[counterIdx] < bounds[j]) bounds[j] = joltage[counterIdx];
				}
			}
		} else {
			bounds[j] = 0;
		}
	}
	
	for (let j = 0; j < numButtons; j++) {
		if (bounds[j] === Infinity) bounds[j] = 0;
	}
	
	// Gaussian elimination to RREF to identify pivot/free variables
	const matrixCopy = matrix.map(row => [...row]);
	const rhs = [...joltage];
	const pivotCols: number[] = [];
	const colToPivotRow = new Map<number, number>();
	let pivotRow = 0;
	
	for (let col = 0; col < numButtons && pivotRow < numCounters; col++) {
		let candidateRow = pivotRow;
		while (candidateRow < numCounters && Math.abs(matrixCopy[candidateRow][col]) < 1e-9) {
			candidateRow++;
		}
		
		if (candidateRow === numCounters) continue;
		
		[matrixCopy[pivotRow], matrixCopy[candidateRow]] = [matrixCopy[candidateRow], matrixCopy[pivotRow]];
		[rhs[pivotRow], rhs[candidateRow]] = [rhs[candidateRow], rhs[pivotRow]];
		
		const pivotVal = matrixCopy[pivotRow][col];
		for (let j = col; j < numButtons; j++) {
			matrixCopy[pivotRow][j] /= pivotVal;
		}
		rhs[pivotRow] /= pivotVal;
		
		for (let i = 0; i < numCounters; i++) {
			if (i !== pivotRow) {
				const factor = matrixCopy[i][col];
				if (Math.abs(factor) > 1e-9) {
					for (let j = col; j < numButtons; j++) {
						matrixCopy[i][j] -= factor * matrixCopy[pivotRow][j];
					}
					rhs[i] -= factor * rhs[pivotRow];
				}
			}
		}
		
		pivotCols.push(col);
		colToPivotRow.set(col, pivotRow);
		pivotRow++;
	}
	
	for (let i = pivotRow; i < numCounters; i++) {
		if (Math.abs(rhs[i]) > 1e-4) return 0;
	}
	
	const isPivot = new Set(pivotCols);
	const freeVars: number[] = [];
	for (let j = 0; j < numButtons; j++) {
		if (!isPivot.has(j)) freeVars.push(j);
	}
	
	// Search through free variable combinations with back-substitution and pruning
	let minPresses = Infinity;
	const solution = new Array(numButtons).fill(0);
	
	const search = (freeVarIdx: number, currentCost: number): void => {
		if (currentCost >= minPresses) return;
		
		if (freeVarIdx === freeVars.length) {
			let totalCost = currentCost;
			let valid = true;
			
			for (let i = pivotCols.length - 1; i >= 0; i--) {
				const pivotCol = pivotCols[i];
				const pivotRowIdx = colToPivotRow.get(pivotCol)!;
				
				let value = rhs[pivotRowIdx];
				for (let j = pivotCol + 1; j < numButtons; j++) {
					if (Math.abs(matrixCopy[pivotRowIdx][j]) > 1e-9) {
						value -= matrixCopy[pivotRowIdx][j] * solution[j];
					}
				}
				
				if (Math.abs(value - Math.round(value)) > 1e-4) {
					valid = false;
					break;
				}
				value = Math.round(value);
				
				if (value < 0 || value > bounds[pivotCol]) {
					valid = false;
					break;
				}
				
				solution[pivotCol] = value;
				totalCost += value;
				
				if (totalCost >= minPresses) {
					valid = false;
					break;
				}
			}
			
			if (valid) minPresses = totalCost;
			return;
		}
		
		const freeVarCol = freeVars[freeVarIdx];
		const bound = bounds[freeVarCol];
		
		for (let val = 0; val <= bound; val++) {
			solution[freeVarCol] = val;
			search(freeVarIdx + 1, currentCost + val);
		}
	};
	
	search(0, 0);
	return minPresses === Infinity ? 0 : minPresses;
}

function parseMachines(input: string): Machine[] {
	const data = aoc.createArray(input, '\n');
	const machines: Machine[] = [];

	for (const line of data) {
		const parts = line.split(' ');
		
		const diagramRaw = parts[0];
		let diagram: boolean[] = [];
		for (const char of diagramRaw) {
			if (char !== "[" && char !== "]") {
				diagram.push(char === '#');
			}
		}
		
		let buttons: number[][] = [];
		let joltage: number[] = [];
		
		for (let i = 1; i < parts.length; i++) {
			const part = parts[i];
			if (part.startsWith('(') && part.endsWith(')')) {
				const buttonStr = part.slice(1, -1);
				if (buttonStr.length > 0) {
					const button = buttonStr.split(',').map(s => parseInt(s, 10));
					buttons.push(button);
				}
			} else if (part.startsWith('{') && part.endsWith('}')) {
				const joltageStr = part.slice(1, -1);
				if (joltageStr.length > 0) {
					joltage = joltageStr.split(',').map(s => parseInt(s, 10));
				}
			}
		}

		// console.log(`Machine ${machines.length}: diagram=${diagram}, buttons=${JSON.stringify(buttons)}, joltage=${JSON.stringify(joltage)}`);
		machines.push({ diagram, buttons, joltage });
	}

	return machines;
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

	const machines = parseMachines(input);
	let result = 0;

	for (let i = 0; i < machines.length; i++) {
		const minPresses = findMinPressesForDiagram(machines[i].diagram, machines[i].buttons);
		result += minPresses;
		// console.log(`Machine ${i} result: ${minPresses}`);
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

	const machines = parseMachines(input);
	let result = 0;

	for (let i = 0; i < machines.length; i++) {
		const minPresses = findMinPressesForJoltage(machines[i].joltage, machines[i].buttons);
		result += minPresses;
		// console.log(`Machine ${i} joltage result: ${minPresses}`);
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