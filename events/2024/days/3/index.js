const fs = require('fs');
const path = require('path');

function part1() {
	const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result = 0;

	const memory = [];
	const pairs = [];
	for (const line of data.split('\n')) memory.push(line.split(''));

	for (const line of memory) {
		for (let i = 0; i < line.length; i++) {
			// console.log('CURRENT i' + i);
			if (line[i] + line[i + 1] + line[i + 2] + line[i+3] === 'mul(') {
				// console.log(i);

				// console.log('found mul( at' + i);
				// find the next full number
				const start = i + 4;
				let end = start;
				const startChar = line[start];
				let endChar = line[end];
				// console.log(startChar);
				// if startChar is a number, contunue
				if (startChar >= 0 && startChar <= 9) {
					while (endChar >= 0 && endChar <= 9) {
						end++;
						endChar = line[end];
					}

					// get the number
					const number = parseInt(line.slice(start, end).join(''));
					// console.log(number)

					// find the next number
					if (line[end] === ',') {
						// console.log(number + line[end])
						const secondStart = end + 1;
						let secondEnd = secondStart;
						const secondStartChar = line[secondStart];
						let secondEndChar = line[secondEnd];

						if (secondStartChar >= 0 && secondStartChar <= 9) {
							while (secondEndChar >= 0 && secondEndChar <= 9) {
								secondEnd++;
								secondEndChar = line[secondEnd];
							}

							const secondNumber = parseInt(line.slice(secondStart, secondEnd).join(''));
							// console.log(secondNumber)

							if (line[secondEnd] === ')') {
								// get the pair
								const pair = [number, secondNumber];
								// console.log(pair);
								pairs.push(pair);
							}

						}
					}
				}

			}
		}
	}

	for (const pair of pairs) {
		result += pair[0] * pair[1];
	}

	return result;
}

function part2() {
	const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result = 0;

	const memory = [];
	const pairs = [];
	for (const line of data.split('\n')) memory.push(line.split(''));

	let enabled = true;
	for (const line of memory) {
		for (let i = 0; i < line.length; i++) {
			// console.log('CURRENT i' + i);
			
			if (line[i] + line[i + 1] + line[i + 2] + line[i+3] === 'do()') {
				enabled = true;
			} else if (line[i] + line[i + 1] + line[i + 2] + line[i+3] + line[i+4] + line[i+5] + line[i+6] === 'don\'t()') {
				enabled = false;
			} else if (line[i] + line[i + 1] + line[i + 2] + line[i+3] === 'mul(' && enabled) {
				// console.log(i);

				// console.log('found mul( at' + i);
				// find the next full number
				const start = i + 4;
				let end = start;
				const startChar = line[start];
				let endChar = line[end];
				// console.log(startChar);
				// if startChar is a number, contunue
				if (startChar >= 0 && startChar <= 9) {
					while (endChar >= 0 && endChar <= 9) {
						end++;
						endChar = line[end];
					}

					// get the number
					const number = parseInt(line.slice(start, end).join(''));
					// console.log(number)

					// find the next number
					if (line[end] === ',') {
						// console.log(number + line[end])
						const secondStart = end + 1;
						let secondEnd = secondStart;
						const secondStartChar = line[secondStart];
						let secondEndChar = line[secondEnd];

						if (secondStartChar >= 0 && secondStartChar <= 9) {
							while (secondEndChar >= 0 && secondEndChar <= 9) {
								secondEnd++;
								secondEndChar = line[secondEnd];
							}

							const secondNumber = parseInt(line.slice(secondStart, secondEnd).join(''));
							// console.log(secondNumber)

							if (line[secondEnd] === ')') {
								// get the pair
								const pair = [number, secondNumber];
								// console.log(pair);
								pairs.push(pair);
							}

						}
					}
				}

			}
		}
	}

	for (const pair of pairs) {
		result += pair[0] * pair[1];
	}

	return result;
}

console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);

module.exports = {
	part1,
	part2,
};