import fs from 'fs';
import path from 'path';
import * as aoc from '../../../../src/lib/utils.ts';

function moveRobot(robot: any, gridHeight: number, gridWidth: number) {
	let newX = robot.pos.x + robot.vel.x;
	let newY = robot.pos.y + robot.vel.y;

	// Wrap around horizontally
	while (newX >= gridWidth) {
		newX -= gridWidth;
	}
	while (newX < 0) {
		newX += gridWidth;
	}

	// Wrap around vertically
	while (newY >= gridHeight) {
		newY -= gridHeight;
	}
	while (newY < 0) {
		newY += gridHeight;
	}

	robot.pos.x = newX;
	robot.pos.y = newY;

	return robot;
}

function part1(): number {
	const input: string = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result: number = 0;

	const data: string[] = aoc.createArray(input);

	let robots: any = [];

	for (const line of data) {
		const [pos, vel] = line.split(' ').map((raw: string) => {
			raw = raw.slice(2);
			const [x, y] = raw.split(',').map(Number);
			return { x, y };
		});

		const robot = {
			pos,
			vel,
		};

		robots.push(robot);
	}

	const gridHeight = 103;
	const gridWidth = 101;
	const seconds = 100;

	for (let i = 0; i < seconds; i++) {
		robots = robots.map((robot: any) => moveRobot(robot, gridHeight, gridWidth));
	}

	const midY = Math.floor(gridHeight / 2);
	const midX = Math.floor(gridWidth / 2);
	const quadrants = {
		topLeft: 0,
		topRight: 0,
		bottomLeft: 0,
		bottomRight: 0,
	};

	for (const robot of robots) {
		console.log(robot.pos.x, robot.pos.y);
		if (robot.pos.x === midX || robot.pos.y === midY) continue;

		if (robot.pos.x < midX && robot.pos.y < midY) {
			quadrants.topLeft++;
		} else if (robot.pos.x > midX && robot.pos.y < midY) {
			quadrants.topRight++;
		} else if (robot.pos.x < midX && robot.pos.y > midY) {
			quadrants.bottomLeft++;
		} else if (robot.pos.x > midX && robot.pos.y > midY) {
			quadrants.bottomRight++;
		}
	}

	const safetyFactor = quadrants.topLeft * quadrants.topRight * quadrants.bottomLeft * quadrants.bottomRight;

	result = safetyFactor;

	return result;
}

function part2(): number {
	const input: string = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result: number = 0;

	const data: string[] = aoc.createArray(input);

	let robots: any = [];

	for (const line of data) {
		const [pos, vel] = line.split(' ').map((raw: string) => {
			raw = raw.slice(2);
			const [x, y] = raw.split(',').map(Number);
			return { x, y };
		});

		const robot = {
			pos,
			vel,
		};

		robots.push(robot);
	}

	const gridHeight = 103;
	const gridWidth = 101;
	let seconds = 0;

	while (true) {
		robots = robots.map((robot: any) => moveRobot(robot, gridHeight, gridWidth));
		seconds++;

		// Checks if there are any robots in the same position, if there aren't, breaks the loop
		const positions: string[] = [];
		let collision = false;
		for (const robot of robots) {
			const pos = `${robot.pos.x},${robot.pos.y}`;
			if (positions.includes(pos)) {
				collision = true;
				break;
			}
			positions.push(pos);
		}

		if (!collision) break;
	}

	result = seconds;

	// Make a grid of the positions
	// const grid: string[][] = [];
	// for (let i = 0; i < gridHeight; i++) {
	// 	grid.push(new Array(gridWidth).fill('.'));
	// }
	// for (const robot of robots) {
	// 	grid[robot.pos.y][robot.pos.x] = '#';
	// }
	// for (const row of grid) {
	// 	console.log(row.join(''));
	// }

	return result;
}

export interface Solution {
	part1: () => number;
	part2: () => number;
}

export default {
	part1,
	part2,
} as Solution;