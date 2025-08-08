import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type Direction = 'U' | 'D' | 'L' | 'R';

interface DigInstruction {
	direction: Direction;
	magnitude: number;
	color: string;
}

type Coordinate = [number, number];

const dirSubs: Record<Direction, Coordinate> = {
	'U': [-1, 0],
	'D': [1, 0],
	'L': [0, -1],
	'R': [0, 1],
};

function calculateArea(digPlan: DigInstruction[]): number {
	const coordPairs: Coordinate[] = [[0, 0]];
	const realCoordPairs: Coordinate[] = [[0, 0]];

	let minX = 0, maxX = 0, minY = 0, maxY = 0;

	for (const dig of digPlan) {
		let [x, y]: Coordinate = [0, 0];
		for (let i = 0; i < dig.magnitude; i++) {
			x += dirSubs[dig.direction][0];
			y += dirSubs[dig.direction][1];
		}
		coordPairs.push([x, y]);
		const realCoord: Coordinate = [
			realCoordPairs[realCoordPairs.length - 1][0] + coordPairs[coordPairs.length - 1][0],
			realCoordPairs[realCoordPairs.length - 1][1] + coordPairs[coordPairs.length - 1][1],
		];
		realCoordPairs.push(realCoord);

		minX = Math.min(minX, realCoord[0]);
		maxX = Math.max(maxX, realCoord[0]);
		minY = Math.min(minY, realCoord[1]);
		maxY = Math.max(maxY, realCoord[1]);
	}

	const shoelace = (vertices: Coordinate[]): number => {
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
			throw new Error('Invalid coordinate movement');
		}

		x = nextX;
		y = nextY;
	}

	// Using Pick's theorem: A = i + b/2 - 1, solving for i + b
	area = (borderLength / 2) + area + 1;

	return area;
}

function hexToMagDir(hex: string): [number, Direction] {
	// Split the hex into the first 5 chars and the last one
	const magHex = hex.substring(0, 5);
	const dirHex = hex.substring(5);

	// Convert the hex to numbers
	const mag = parseInt(magHex, 16);
	const dirNum = parseInt(dirHex, 16);

	let dir: Direction;
	switch (dirNum) {
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
		default:
			throw new Error(`Invalid direction number: ${dirNum}`);
	}

	return [mag, dir];
}

function part1(): number {
	const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');

	const digPlan: DigInstruction[] = [];

	for (const line of data.split('\n')) {
		const [direction, magnitudeStr, colorStr] = line.split(' ');
		const magnitude = Number(magnitudeStr);
		const color = colorStr.substring(2, colorStr.length - 1);
		digPlan.push({
			direction: direction as Direction,
			magnitude,
			color,
		});
	}

	return calculateArea(digPlan);
}

function part2(): number {
	const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');

	const digPlan: DigInstruction[] = [];

	for (const line of data.split('\n')) {
		const [, , colorStr] = line.split(' ');
		const color = colorStr.substring(2, colorStr.length - 1);
		const [magnitude, direction] = hexToMagDir(color);
		digPlan.push({
			direction,
			magnitude,
			color,
		});
	}

	return calculateArea(digPlan);
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
