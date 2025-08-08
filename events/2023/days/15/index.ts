import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Lens {
	label: string;
	number: number;
}

type Box = Lens[];

function getASCII(char: string): number {
	return char.charCodeAt(0);
}

function parseHASH(hash: string): number {
	let value = 0;
	for (const char of hash.split('')) {
		value += getASCII(char);
		value *= 17;
		value %= 256;
	}
	return value;
}

function part1(): number {
	const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result = 0;

	for (const line of data.split(',')) {
		result += parseHASH(line);
	}

	return result;
}

function part2(): number {
	const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').split(',');
	let result = 0;

	const boxes: Box[] = [];

	for (const hash of data) {
		const operation = hash.includes('=') ? '=' : '-';

		if (operation === '=') {
			const [label, numberStr] = hash.split('=');
			const number = Number(numberStr);
			const boxIndex = parseHASH(label);

			// If the box doesn't exist, create it and fill the blank boxes with empty arrays
			if (!boxes[boxIndex]) {
				boxes[boxIndex] = [];
				for (let i = 0; i < boxIndex; i++) {
					if (!boxes[i]) {
						boxes[i] = [];
					}
				}
			}

			let exists = false;
			for (const lens of boxes[boxIndex]) {
				if (lens.label === label) {
					lens.number = number;
					exists = true;
					break;
				}
			}

			if (!exists) {
				// Put it at the end
				boxes[boxIndex].push({ label, number });
			}

		} else if (operation === '-') {
			const [label] = hash.split('-');
			const boxIndex = parseHASH(label);

			if (!boxes[boxIndex]) {
				continue;
			}

			for (let i = 0; i < boxes[boxIndex].length; i++) {
				const lens = boxes[boxIndex][i];
				// If it exists, remove it
				if (lens.label === label) {
					boxes[boxIndex].splice(i, 1);
					break;
				}
			}
		}
	}

	for (let i = 0; i < boxes.length; i++) {
		if (boxes[i]) {
			for (let j = 0; j < boxes[i].length; j++) {
				result += (i + 1) * (j + 1) * boxes[i][j].number;
			}
		}
	}

	return result;
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
