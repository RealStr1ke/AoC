import fs from 'fs';
import path from 'path';

function part1() {
	const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result = 0;

	const left = [];
	const right = [];

	for (const line of data.split('\n')) {
		const [l, r] = line.split('   ');
		left.push(l);
		right.push(r);
	}

	const leftNum = left.map(Number);
	leftNum.sort((a, b) => a - b);

	const rightNum = right.map(Number);
	rightNum.sort((a, b) => a - b);

	const pairs = [];
	for (let i = 0; i < leftNum.length; i++) pairs.push([leftNum[i], rightNum[i]]);

	for (const [l, r] of pairs) result += Math.abs(l - r);

	return result;
}

function part2() {
	const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result = 0;

	const left = [];
	const right = [];

	for (const line of data.split('\n')) {
		const [l, r] = line.split('   ');
		left.push(l);
		right.push(r);
	}

	const leftNum = left.map(Number);
	leftNum.sort((a, b) => a - b);

	const rightNum = right.map(Number);
	rightNum.sort((a, b) => a - b);

	const leftCount = {};
	const rightCount = {};

	for (const num of leftNum) leftCount[num] = (leftCount[num] || 0) + 1;
	for (const num of rightNum) rightCount[num] = (rightCount[num] || 0) + 1;

	for (const num of leftNum) if (rightCount[num]) result += num * rightCount[num];

	return result;
}

// console.log(`Part 1: ${part1()}`);
// console.log(`Part 2: ${part2()}`);

export default {
	part1,
	part2,
};