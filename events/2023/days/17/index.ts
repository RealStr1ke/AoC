import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function part1(): number {
	const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	const map = input.split('\n');
	
	for (const line of map) {
		const _numbers = line.split('').map(num => parseInt(num, 10));
		// TODO: Implement day 17 part 1 logic
	}

	return 0;
}

function part2(): number {
	const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	
	for (const _line of input.split('\n')) {
		// TODO: Implement day 17 part 2 logic
	}

	return 0;
}

interface Solution {
	part1: () => number;
	part2: () => number;
}

const solution: Solution = {
	part1,
	part2,
};

export default solution;
