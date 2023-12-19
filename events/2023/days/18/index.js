const fs = require('fs');
const path = require('path');

function calculateArea(digPlan) {
	// Iterate through the dig plan to get the max x and y values
	const coordPairs = [ [0, 0] ];
	const realCoordPairs = [ [0, 0] ];
	const dirSubs = {
		'U': [-1, 0],
		'D': [1, 0],
		'L': [0, -1],
		'R': [0, 1],
	};

	for (const dig of digPlan) {
		let [x, y] = [0, 0];
		for (let i = 0; i < dig.magnitude; i++) {
			x += dirSubs[dig.direction][0];
			y += dirSubs[dig.direction][1];
		}
		coordPairs.push([x, y]);
		realCoordPairs.push(realCoordPairs[realCoordPairs.length - 1].map((val, i) => val + coordPairs[coordPairs.length - 1][i]));
		// console.log(realCoordPairs[realCoordPairs.length - 1]);
	}

	// Calculate the area of the bounding box
	let minX = 0;
	let maxX = 0;
	let minY = 0;
	let maxY = 0;

	for (const coord of realCoordPairs) {
		if (coord[0] < minX) {
			minX = coord[0];
		}
		if (coord[0] > maxX) {
			maxX = coord[0];
		}
		if (coord[1] < minY) {
			minY = coord[1];
		}
		if (coord[1] > maxY) {
			maxY = coord[1];
		}
	}


	// for (const coord of coordPairs) {
	// 	coord[0] += Math.abs(minX);
	// 	coord[1] += Math.abs(minY);
	// 	console.log(coord);
	// 	// process.exit();
	// }

	const startPoint = [Math.abs(minX), Math.abs(minY)];
	maxX = Math.abs(minX) + maxX;
	minX = 0;
	maxY = Math.abs(minY) + maxY;
	minY = 0;

	// console.log(minX, maxX, minY, maxY);

	// Make the grid of the bounding box
	// const grid = [];
	// for (let i = 0; i < maxX + 1; i++) {
	// 	grid.push('.'.repeat(maxY + 1).split(''));
	// 	// console.log(grid[i]);
	// }

	// Calculate the area by using the shoelace formula
	const mapVerts = [];
	for (const coord of realCoordPairs) {
		mapVerts.push(coord);
	}
	const shoelace = (vertices) => {
		const xcs = vertices.map((v) => v[0]);
		const ycs = vertices.map((v) => v[1]);
		// Move the last y coordinate to the front
		ycs.unshift(ycs.pop());

		let area = 0;
		for (let i = 0; i < vertices.length; i++) {
			area += xcs[i] * ycs[i];
		}

		// Move the first y coordinate to the back
		ycs.push(ycs.shift());

		// Move the last x coordinate to the front
		xcs.unshift(xcs.pop());

		for (let i = 0; i < vertices.length; i++) {
			area -= xcs[i] * ycs[i];
		}

		return Math.abs(area) / 2;
	};

	let area = shoelace(mapVerts);
	// console.log(area);

	// process.exit();

	// Map out the dig plan
	let x = startPoint[0];
	let y = startPoint[1];
	const plan = [];

	let bC = 0;
	for (let i = 0; i < realCoordPairs.length; i++) {
		const nextCoord = coordPairs[i];
		const nextX = x + nextCoord[0];
		const nextY = y + nextCoord[1];
		// console.log(`(${x}, ${y}) -> (${nextX}, ${nextY})`);

		if (nextX === x) {
			if (nextY < y) {
				for (let j = nextY; j <= y; j++) {
					// console.log(j, nextX);
					// console.log(grid[nextX]);
					// grid[nextX][j] = '#';
					// if (!plan.includes([nextX, j])) plan.push([nextX, j]);
					if (!plan.includes([nextX, j])) bC++;
				}
			} else if (nextY > y) {
				for (let j = y; j <= nextY; j++) {
					// grid[nextX][j] = '#';
					// if (!plan.includes([nextX, j])) plan.push([nextX, j]);
					if (!plan.includes([nextX, j])) bC++;
				}
			}
		} else if (nextY === y) {
			if (nextX < x) {
				for (let j = nextX; j <= x; j++) {
					// grid[j][nextY] = '#';
					// if (!plan.includes([j, nextY])) plan.push([j, nextY]);
					if (!plan.includes([j, nextY])) bC++;
				}
			} else if (nextX > x) {
				for (let j = x; j <= nextX; j++) {
					// grid[j][nextY] = '#';
					// if (!plan.includes([j, nextY])) plan.push([j, nextY]);
					if (!plan.includes([j, nextY])) bC++;
				}
			}
		} else {
			throw new Error('How tf did you get here?');
		}

		x = nextX;
		y = nextY;
	}
	// console.log(plan.length, vertices.length); process.exit();

	// Don't ask me why tf this goofy code works, but it does
	// I know we all love off by one errors
	bC = bC - mapVerts.length + 1;
	area = (bC / 2) + area + 1;

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
	console.log(mag, dir);
	return [mag, dir];


}

function part1() {
	const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result = 0;

	const digPlan = [];

	for (const line of data.split('\n')) {
		let [direction, magnitude, color] = line.split(' ');
		color = color.substring(2, color.length - 1);
		// [magnitude, direction] = hexToMagDir(color);
		// console.log(direction, magnitude, color);
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
		// console.log(direction, magnitude, color);
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

// console.log(`Part 1: ${part1()}`);
// console.log(`Part 2: ${part2()}`);

module.exports = {
	part1,
	part2,
};