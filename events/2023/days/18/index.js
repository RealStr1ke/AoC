const fs = require('fs');
const path = require('path');

function calculateArea(digPlan) {
	const coordPairs = [ [0, 0] ];
	const realCoordPairs = [ [0, 0] ];
	const dirSubs = {
		'U': [-1, 0],
		'D': [1, 0],
		'L': [0, -1],
		'R': [0, 1],
	};

	let minX = 0, maxX = 0, minY = 0, maxY = 0;

	for (const dig of digPlan) {
		let [x, y] = [0, 0];
		for (let i = 0; i < dig.magnitude; i++) {
			x += dirSubs[dig.direction][0];
			y += dirSubs[dig.direction][1];
		}
		coordPairs.push([x, y]);
		const realCoord = realCoordPairs[realCoordPairs.length - 1].map((val, i) => val + coordPairs[coordPairs.length - 1][i]);
		realCoordPairs.push(realCoord);

		minX = Math.min(minX, realCoord[0]);
		maxX = Math.max(maxX, realCoord[0]);
		minY = Math.min(minY, realCoord[1]);
		maxY = Math.max(maxY, realCoord[1]);
	}

	const shoelace = (vertices) => {
		let area = 0;
		for (let i = 0; i < vertices.length - 1; i++) {
			area += vertices[i][0] * vertices[i + 1][1] - vertices[i + 1][0] * vertices[i][1];
		}
		return Math.abs(area) / 2;
	};

	let area = shoelace(realCoordPairs);
	let x = Math.abs(minX), y = Math.abs(minY);
	let borderLength = 0;
	for (let i = 0; i < realCoordPairs.length; i++) {
		const nextCoord = coordPairs[i];
		const nextX = x + nextCoord[0];
		const nextY = y + nextCoord[1];

		if (nextX === x) {
			borderLength += Math.abs(nextY - y);
		} else if (nextY === y) {
			borderLength += Math.abs(nextX - x);
		} else {
			throw new Error('How tf did you get here?');
		}

		x = nextX;
		y = nextY;
	}

	// idk why tf this works but it does, don't question it
	area = (borderLength / 2) + area + 1;

	return area;
}

function hexToMagDir(hex) {
	// Split the hex into the first 5 chars and the last one
	const magHex = hex.substring(0, 5);
	const dirHex = hex.substring(5);

	// Convert the hex to numbers
	const mag = parseInt(magHex, 16);
	let dir = parseInt(dirHex, 16);

	switch (dir) {
	case 0:
		dir = 'R';
		break;
	case 1:
		dir = 'D';
		break;
	case 2:
		dir = 'L';
		break;
	case 3:
		dir = 'U';
		break;
	}
	return [mag, dir];


}

function part1() {
	const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result = 0;

	const digPlan = [];

	for (const line of data.split('\n')) {
		let [direction, magnitude, color] = line.split(' ');
		color = color.substring(2, color.length - 1);
		digPlan.push({
			direction,
			magnitude,
			color,
		});
	}

	const area = calculateArea(digPlan);
	result = area;

	return result;
}

function part2() {
	const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result = 0;

	const digPlan = [];

	for (const line of data.split('\n')) {
		let [direction, magnitude, color] = line.split(' ');
		color = color.substring(2, color.length - 1);
		[magnitude, direction] = hexToMagDir(color);
		digPlan.push({
			direction,
			magnitude,
			color,
		});
	}

	const area = calculateArea(digPlan);
	result = area;

	return result;
}

console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);

module.exports = {
	part1,
	part2,
};