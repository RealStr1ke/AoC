import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface SeedObject {
	seed: number;
	soil?: number;
	fertilizer?: number;
	water?: number;
	light?: number;
	temperature?: number;
	humidity?: number;
	location?: number;
}

interface Maps {
	seedToSoil: number[][];
	soilToFertilizer: number[][];
	fertilizerToWater: number[][];
	waterToLight: number[][];
	lightToTemperature: number[][];
	temperatureToHumidity: number[][];
	humidityToLocation: number[][];
}

function part1(): number {
	const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	const fileLines = input.split('\n');

	const seedNums = fileLines[0].split(' ').map(Number).filter(Boolean);

	const mapsRaw: number[][][] = [];
	for (let i = 1; i < fileLines.length; i++) {
		const map: number[][] = [];
		const mapLines: string[] = [];
		while (fileLines[i] !== '') {
			mapLines.push(fileLines[i]);
			i++;
		}
		for (const line of mapLines) {
			map.push(line.split(' ').map(Number));
		}
		mapsRaw.push(map);
	}
	
	// For mapsRaw, remove all empty arrays and remove the first element of all the other arrays
	for (let i = 0; i < mapsRaw.length; i++) {
		if (mapsRaw[i].length === 0) {
			mapsRaw.splice(i, 1);
			i--;
			continue;
		} else {
			mapsRaw[i].shift();
		}
	}

	// Parse mapsRaw into a usable format
	const maps: Maps = {
		seedToSoil: mapsRaw[0],
		soilToFertilizer: mapsRaw[1],
		fertilizerToWater: mapsRaw[2],
		waterToLight: mapsRaw[3],
		lightToTemperature: mapsRaw[4],
		temperatureToHumidity: mapsRaw[5],
		humidityToLocation: mapsRaw[6],
	};

	const seeds: SeedObject[] = [];
	for (const seed of seedNums) {
		const seedObj: SeedObject = { seed };

		// To soil
		for (const soilMap of maps.seedToSoil) {
			const [destRange, sourceRange, range] = soilMap;

			if (seedObj.seed >= sourceRange && seedObj.seed < (sourceRange + range)) {
				const diff = destRange - sourceRange;
				seedObj.soil = seedObj.seed + diff;
				break;
			}
		}

		// To fertilizer
		for (const fertilizerMap of maps.soilToFertilizer) {
			const [destRange, sourceRange, range] = fertilizerMap;

			if ((seedObj.soil ?? seedObj.seed) >= sourceRange && (seedObj.soil ?? seedObj.seed) < (sourceRange + range)) {
				const diff = destRange - sourceRange;
				seedObj.fertilizer = (seedObj.soil ?? seedObj.seed) + diff;
				break;
			}
		}

		// To water
		for (const waterMap of maps.fertilizerToWater) {
			const [destRange, sourceRange, range] = waterMap;

			if ((seedObj.fertilizer ?? seedObj.soil ?? seedObj.seed) >= sourceRange && (seedObj.fertilizer ?? seedObj.soil ?? seedObj.seed) < (sourceRange + range)) {
				const diff = destRange - sourceRange;
				seedObj.water = (seedObj.fertilizer ?? seedObj.soil ?? seedObj.seed) + diff;
				break;
			}
		}

		// To light
		for (const lightMap of maps.waterToLight) {
			const [destRange, sourceRange, range] = lightMap;

			if ((seedObj.water ?? seedObj.fertilizer ?? seedObj.soil ?? seedObj.seed) >= sourceRange && (seedObj.water ?? seedObj.fertilizer ?? seedObj.soil ?? seedObj.seed) < (sourceRange + range)) {
				const diff = destRange - sourceRange;
				seedObj.light = (seedObj.water ?? seedObj.fertilizer ?? seedObj.soil ?? seedObj.seed) + diff;
				break;
			}
		}

		// To temperature
		for (const temperatureMap of maps.lightToTemperature) {
			const [destRange, sourceRange, range] = temperatureMap;

			if ((seedObj.light ?? seedObj.water ?? seedObj.fertilizer ?? seedObj.soil ?? seedObj.seed) >= sourceRange && (seedObj.light ?? seedObj.water ?? seedObj.fertilizer ?? seedObj.soil ?? seedObj.seed) < (sourceRange + range)) {
				const diff = destRange - sourceRange;
				seedObj.temperature = (seedObj.light ?? seedObj.water ?? seedObj.fertilizer ?? seedObj.soil ?? seedObj.seed) + diff;
				break;
			}
		}

		// To humidity
		for (const humidityMap of maps.temperatureToHumidity) {
			const [destRange, sourceRange, range] = humidityMap;

			if ((seedObj.temperature ?? seedObj.light ?? seedObj.water ?? seedObj.fertilizer ?? seedObj.soil ?? seedObj.seed) >= sourceRange && (seedObj.temperature ?? seedObj.light ?? seedObj.water ?? seedObj.fertilizer ?? seedObj.soil ?? seedObj.seed) < (sourceRange + range)) {
				const diff = destRange - sourceRange;
				seedObj.humidity = (seedObj.temperature ?? seedObj.light ?? seedObj.water ?? seedObj.fertilizer ?? seedObj.soil ?? seedObj.seed) + diff;
				break;
			}
		}

		// To location
		for (const locationMap of maps.humidityToLocation) {
			const [destRange, sourceRange, range] = locationMap;

			if ((seedObj.humidity ?? seedObj.temperature ?? seedObj.light ?? seedObj.water ?? seedObj.fertilizer ?? seedObj.soil ?? seedObj.seed) >= sourceRange && (seedObj.humidity ?? seedObj.temperature ?? seedObj.light ?? seedObj.water ?? seedObj.fertilizer ?? seedObj.soil ?? seedObj.seed) < (sourceRange + range)) {
				const diff = destRange - sourceRange;
				seedObj.location = (seedObj.humidity ?? seedObj.temperature ?? seedObj.light ?? seedObj.water ?? seedObj.fertilizer ?? seedObj.soil ?? seedObj.seed) + diff;
				break;
			}
		}

		seeds.push(seedObj);
	}

	// Sort the seeds by location and grab the lowest location
	seeds.sort((a, b) => (a.location ?? 0) - (b.location ?? 0));
	return seeds[0].location ?? 0;
}

function part2(): number {
	const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	const fileLines = input.split('\n');

	const mapsRaw: number[][][] = [];
	for (let i = 1; i < fileLines.length; i++) {
		const map: number[][] = [];
		const mapLines: string[] = [];
		while (fileLines[i] !== '') {
			mapLines.push(fileLines[i]);
			i++;
		}
		for (const line of mapLines) {
			map.push(line.split(' ').map(Number));
		}
		mapsRaw.push(map);
	}
	
	// For mapsRaw, remove all empty arrays and remove the first element of all the other arrays
	for (let i = 0; i < mapsRaw.length; i++) {
		if (mapsRaw[i].length === 0) {
			mapsRaw.splice(i, 1);
			i--;
			continue;
		} else {
			mapsRaw[i].shift();
		}
	}

	// Parse mapsRaw into a usable format
	const maps: Maps = {
		seedToSoil: mapsRaw[0],
		soilToFertilizer: mapsRaw[1],
		fertilizerToWater: mapsRaw[2],
		waterToLight: mapsRaw[3],
		lightToTemperature: mapsRaw[4],
		temperatureToHumidity: mapsRaw[5],
		humidityToLocation: mapsRaw[6],
	};

	// Parse the seed numbers
	const seedLine = fileLines[0].split(' ').map(Number).filter(Boolean);
	const seedRanges: number[][] = [];
	for (let i = 0; i < seedLine.length; i += 2) {
		seedRanges.push([seedLine[i], seedLine[i + 1]]);
	}

	let locationLowest = Infinity;
	for (const seedRange of seedRanges) {
		const [start, rangeSize] = seedRange;
		for (let i = 0; i < rangeSize; i++) {
			const seed = start + i;
			const seedObj: SeedObject = { seed };

			// To soil
			for (const soilMap of maps.seedToSoil) {
				const [destRange, sourceRange, mapRange] = soilMap;

				if (seedObj.seed >= sourceRange && seedObj.seed < (sourceRange + mapRange)) {
					const diff = destRange - sourceRange;
					seedObj.soil = seedObj.seed + diff;
					break;
				}
			}

			// To fertilizer
			for (const fertilizerMap of maps.soilToFertilizer) {
				const [destRange, sourceRange, mapRange] = fertilizerMap;

				if ((seedObj.soil ?? seedObj.seed) >= sourceRange && (seedObj.soil ?? seedObj.seed) < (sourceRange + mapRange)) {
					const diff = destRange - sourceRange;
					seedObj.fertilizer = (seedObj.soil ?? seedObj.seed) + diff;
					break;
				}
			}

			// To water
			for (const waterMap of maps.fertilizerToWater) {
				const [destRange, sourceRange, mapRange] = waterMap;

				if ((seedObj.fertilizer ?? seedObj.soil ?? seedObj.seed) >= sourceRange && (seedObj.fertilizer ?? seedObj.soil ?? seedObj.seed) < (sourceRange + mapRange)) {
					const diff = destRange - sourceRange;
					seedObj.water = (seedObj.fertilizer ?? seedObj.soil ?? seedObj.seed) + diff;
					break;
				}
			}

			// To light
			for (const lightMap of maps.waterToLight) {
				const [destRange, sourceRange, mapRange] = lightMap;

				if ((seedObj.water ?? seedObj.fertilizer ?? seedObj.soil ?? seedObj.seed) >= sourceRange && (seedObj.water ?? seedObj.fertilizer ?? seedObj.soil ?? seedObj.seed) < (sourceRange + mapRange)) {
					const diff = destRange - sourceRange;
					seedObj.light = (seedObj.water ?? seedObj.fertilizer ?? seedObj.soil ?? seedObj.seed) + diff;
					break;
				}
			}

			// To temperature
			for (const temperatureMap of maps.lightToTemperature) {
				const [destRange, sourceRange, mapRange] = temperatureMap;

				if ((seedObj.light ?? seedObj.water ?? seedObj.fertilizer ?? seedObj.soil ?? seedObj.seed) >= sourceRange && (seedObj.light ?? seedObj.water ?? seedObj.fertilizer ?? seedObj.soil ?? seedObj.seed) < (sourceRange + mapRange)) {
					const diff = destRange - sourceRange;
					seedObj.temperature = (seedObj.light ?? seedObj.water ?? seedObj.fertilizer ?? seedObj.soil ?? seedObj.seed) + diff;
					break;
				}
			}

			// To humidity
			for (const humidityMap of maps.temperatureToHumidity) {
				const [destRange, sourceRange, mapRange] = humidityMap;

				if ((seedObj.temperature ?? seedObj.light ?? seedObj.water ?? seedObj.fertilizer ?? seedObj.soil ?? seedObj.seed) >= sourceRange && (seedObj.temperature ?? seedObj.light ?? seedObj.water ?? seedObj.fertilizer ?? seedObj.soil ?? seedObj.seed) < (sourceRange + mapRange)) {
					const diff = destRange - sourceRange;
					seedObj.humidity = (seedObj.temperature ?? seedObj.light ?? seedObj.water ?? seedObj.fertilizer ?? seedObj.soil ?? seedObj.seed) + diff;
					break;
				}
			}

			// To location
			for (const locationMap of maps.humidityToLocation) {
				const [destRange, sourceRange, mapRange] = locationMap;

				if ((seedObj.humidity ?? seedObj.temperature ?? seedObj.light ?? seedObj.water ?? seedObj.fertilizer ?? seedObj.soil ?? seedObj.seed) >= sourceRange && (seedObj.humidity ?? seedObj.temperature ?? seedObj.light ?? seedObj.water ?? seedObj.fertilizer ?? seedObj.soil ?? seedObj.seed) < (sourceRange + mapRange)) {
					const diff = destRange - sourceRange;
					seedObj.location = (seedObj.humidity ?? seedObj.temperature ?? seedObj.light ?? seedObj.water ?? seedObj.fertilizer ?? seedObj.soil ?? seedObj.seed) + diff;
					break;
				}
			}

			if ((seedObj.location ?? 0) < locationLowest) {
				locationLowest = seedObj.location ?? 0;
			}
		}
	}

	return locationLowest;
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
