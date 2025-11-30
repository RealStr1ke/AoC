import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Route {
	left: string;
	right: string;
}

type Routes = Record<string, Route>;
type Direction = 'L' | 'R';

function part1(inputSource?: string | { file: string }): number {
	let input: string;
	if (!inputSource) {
		input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	} else if (typeof inputSource === 'string') {
		input = inputSource;
	} else {
		input = fs.readFileSync(path.join(__dirname, inputSource.file), 'utf8');
	}
	const rawLines = input.split('\n');

	const turns = rawLines[0].split('') as Direction[];

	const routes: Routes = {};
	// Parse the rest of the input
	for (let i = 2; i < rawLines.length; i++) {
		// Lines look like this: "XXX = (YYY, ZZZ)"
		const line = rawLines[i].split(' = ');
		const currentLocation = line[0];
		const leftRight = line[1].split(', ').map(x => x.replace('(', '').replace(')', ''));

		// Add the current location to the routes object
		routes[currentLocation] = {
			left: leftRight[0],
			right: leftRight[1],
		};
	}

	let currentLocation = 'AAA';
	let index = 0;
	let totalTurns = 0;
	
	while (currentLocation !== 'ZZZ') {
		if (index === turns.length) index = 0;
		const turn = turns[index];
		const currentRoute = routes[currentLocation];
		if (turn === 'L') currentLocation = currentRoute.left;
		else if (turn === 'R') currentLocation = currentRoute.right;
		index++;
		totalTurns++;
	}

	return totalTurns;
}

function gcd(a: number, b: number): number {
	return !b ? a : gcd(b, a % b);
}

function lcm(a: number, b: number): number {
	return (a * b) / gcd(a, b);
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
	const rawLines = input.split('\n');

	const turns = rawLines[0].split('') as Direction[];

	const routes: Routes = {};
	// Parse the rest of the input
	for (let i = 2; i < rawLines.length; i++) {
		// Lines look like this: "XXX = (YYY, ZZZ)"
		const line = rawLines[i].split(' = ');
		const currentLocation = line[0];
		const leftRight = line[1].split(', ').map(x => x.replace('(', '').replace(')', ''));

		// Add the current location to the routes object
		routes[currentLocation] = {
			left: leftRight[0],
			right: leftRight[1],
		};
	}

	// Find all the locations that end with A
	const locationsA = Object.keys(routes).filter(x => x.endsWith('A'));
	// Find all the locations that end with Z
	const locationsZ = Object.keys(routes).filter(x => x.endsWith('Z'));

	// For each location that ends with A, find the shortest path to a location that ends with Z
	const shortestPaths: number[] = [];

	for (const locationA of locationsA) {
		let currentLocation = locationA;
		let index = 0;
		let totalTurns = 0;
		
		while (!locationsZ.includes(currentLocation)) {
			if (index === turns.length) index = 0;
			const turn = turns[index];
			const currentRoute = routes[currentLocation];
			if (turn === 'L') currentLocation = currentRoute.left;
			else if (turn === 'R') currentLocation = currentRoute.right;
			index++;
			totalTurns++;
		}
		shortestPaths.push(totalTurns);
	}

	// Find the LCM of the values in shortestPaths
	return shortestPaths.reduce(lcm);
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
