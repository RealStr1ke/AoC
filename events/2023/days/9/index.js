const fs = require('fs');
const path = require('path');
const math = require('mathjs');

function extrapolate(nums, type) {
	if (type == 'forwards') {
		const originalNums = nums;

		const subNums = [ nums ];

		const lastSubAllZero = () => {
			return subNums[subNums.length - 1].every((num) => {
				return num === 0;
			});
		};

		while (!lastSubAllZero()) {
			// Make an array of the differences between each number of the last subNums
			const diffs = [];
			for (let i = 0; i < subNums[subNums.length - 1].length - 1; i++) {
				diffs.push(subNums[subNums.length - 1][i + 1] - subNums[subNums.length - 1][i]);
			}

			// Add the diffs to the subNums
			subNums.push(diffs);
		}

		// console.log(subNums)

		// Predict the next number for the first subNums
		subNums[subNums.length - 1].push(0);
		for (let i = subNums.length - 2; i >= 0; i--) {

			subNums[i].push(subNums[i + 1][subNums[i + 1].length - 1] + subNums[i][subNums[i].length - 1]);
		}

		return subNums[0];
	} else if (type == 'backwards') {
		const originalNums = nums;

		const subNums = [ nums ];

		const lastSubAllZero = () => {
			return subNums[subNums.length - 1].every((num) => {
				return num === 0;
			});
		};

		while (!lastSubAllZero()) {
			// Make an array of the differences between each number of the last subNums
			const diffs = [];
			for (let i = 0; i < subNums[subNums.length - 1].length - 1; i++) {
				diffs.push(subNums[subNums.length - 1][i + 1] - subNums[subNums.length - 1][i]);
			}

			// Add the diffs to the subNums
			subNums.push(diffs);
		}

		// console.log(subNums)

		// Predict the previous number for the first subNums
		subNums[subNums.length - 1].unshift(0);
		for (let i = subNums.length - 2; i >= 0; i--) {
			subNums[i].unshift(subNums[i][0] - subNums[i + 1][0]);
		}

		return subNums[0];
	}

}

function part1() {
	const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result = 0;

	for (const line of data.split('\n')) {
		const originalLine = line;
		const originalNums = line.split(' ');

		const nums = line.split(' ').map(Number);
		// console.log(nums)
		let extrapolated = extrapolate(nums, 'forwards');
		extrapolated = extrapolated[extrapolated.length - 1];

		result += extrapolated;
	}

	return result;
}

function part2() {
	const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result = 0;

	for (const line of data.split('\n')) {
		const originalLine = line;
		const originalNums = line.split(' ');

		const nums = line.split(' ').map(Number);
		let extrapolated = extrapolate(nums, 'backwards');
		extrapolated = extrapolated[0];

		result += extrapolated;
	}

	return result;
}

module.exports = {
	part1,
	part2,
};