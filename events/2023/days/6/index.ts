import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Race {
	time: number;
	distance: number;
}

function isNum(char: string): boolean {
	return /[0-9]/.test(char);
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
	const lines = input.split('\n');
	const times = lines[0].split(' ').map(Number).filter(Boolean);
	const distances = lines[1].split(' ').map(Number).filter(Boolean);

	const currentWRs: Race[] = [];
	for (let i = 0; i < times.length; i++) {
		currentWRs.push({ time: times[i], distance: distances[i] });
	}

	let result = 1;
	for (const currentWR of currentWRs) {
		// Calculate all the ways you could beat those WRs
		// Split the time into the part where you press the button and the part afterwards and the boat is moving
		const time = currentWR.time;
		const distance = currentWR.distance;

		// Find the amount of runs with the same time that beats the distance WR
		let runsThatBeatWR = 0;
		for (let j = 0; j < time; j++) {
			const posButton = j;
			const posBoat = posButton * (time - posButton);
			if (posBoat > distance) {
				runsThatBeatWR++;
			}
		}

		// Multiply the result by the amount of runs that beat the WR
		result *= runsThatBeatWR;
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
	const lines = input.split('\n');
	const times = lines[0].split('');
	const distances = lines[1].split('');
	
	let mainTime = '';
	let mainDistance = '';
	for (const char of times) {
		if (isNum(char)) mainTime += char;
	}
	for (const char of distances) {
		if (isNum(char)) mainDistance += char;
	}

	const time = Number(mainTime);
	const distance = Number(mainDistance);

	let runsThatBeatWR = 0;
	// Calculate all the ways you could beat those WRs
	// Split the time into the part where you press the button and the part afterwards and the boat is moving
	for (let j = 0; j < time; j++) {
		const posButton = j;
		const posBoat = posButton * (time - posButton);
		if (posBoat > distance) {
			runsThatBeatWR++;
		}
	}

	return runsThatBeatWR;
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
