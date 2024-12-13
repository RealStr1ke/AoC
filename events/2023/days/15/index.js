import fs from 'fs';
import path from 'path';

function getASCII(char) {
	return char.charCodeAt(0);
}

function parseHASH(hash) {
	let value = 0;
	for (const char of hash.split('')) {
		value += getASCII(char);
		value *= 17;
		value %= 256;
	}
	return value;
}

function part1() {
	const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result = 0;

	for (const line of data.split(',')) {
		result += parseHASH(line);
	}

	return result;
}

function part2() {
	const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').split(',');
	let result = 0;

	const boxes = []; // [ [ { label: String , number: Number }, ... ], ...  ]
	for (const hash of data) {
		const operation = hash.includes('=') ? '=' : '-';
		// console.log(`${hash} has operation ${operation}`);

		if (operation === '=') {
			const [label, number] = hash.split('=');
			const boxIndex = parseHASH(label);
			console.log(boxIndex, operation);


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
				// Put it at the beginning
				boxes[boxIndex].push({ label, number });
			}


		} else if (operation === '-') {
			const [label, number] = hash.split('-');
			const boxIndex = parseHASH(label);

			console.log(boxIndex, operation);

			if (!boxes[boxIndex]) {
				continue;
			}

			let exists = false;
			for (let i = 0; i < boxes[boxIndex].length; i++) {
				const lens = boxes[boxIndex][i];
				// If it exists, remove it
				if (lens.label === label) {
					console.log(`Removing ${label} from box ${boxIndex}`);
					boxes[boxIndex].splice(i, 1);
					exists = true;
					break;
				}
			}

		} else {
			console.log(`Unknown operation ${operation} in ${hash}`);
			console.log('How tf did you get here?');
			process.exit(1);
		}

	}

	for (let i = 0; i < boxes.length; i++) {
		let boxesString = '';
		for (const box of boxes[i]) {
			boxesString += `[${box.label} ${box.number}] `;
		}
		console.log(`Box ${i}: ${boxesString}`);
	}

	for (let i = 0; i < boxes.length; i++) {
		for (let j = 0; j < boxes[i].length; j++) {
			result += (i + 1) * (j + 1) * boxes[i][j].number;
		}
	}


	return result;
}

export default {
	part1,
	part2,
};