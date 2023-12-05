const fs = require('fs');

function part1() {
	fs.open('input.txt', 'r', (err, fd) => {
		// Any variables
		// let result = 0;
		let result;

		const fileLines = [];

		for (const line of fs.readFileSync(fd, 'utf8').split('\n')) {
			fileLines.push(line);
		}

		const seedNums = fileLines[0].split(' ').map(Number).filter(Boolean);

		const mapsRaw = [];
		for (let i = 1; i < fileLines.length; i++) {
			const map = [];
			const mapLines = [];
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
		const maps = {
			seedToSoil: mapsRaw[0],
			soilToFertilizer: mapsRaw[1],
			fertilizerToWater: mapsRaw[2],
			waterToLight: mapsRaw[3],
			lightToTemperature: mapsRaw[4],
			temperatureToHumidity: mapsRaw[5],
			humidityToLocation: mapsRaw[6],
		};

		console.log(maps);

		const seeds = [];
		for (const seed of seedNums) {
			const seedObj = {};
			seedObj.seed = seed;

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

				if (seedObj.soil >= sourceRange && seedObj.soil < (sourceRange + range)) {
					const diff = destRange - sourceRange;
					seedObj.fertilizer = seedObj.soil + diff;
					break;
				}
			}

			// To water
			for (const waterMap of maps.fertilizerToWater) {
				const [destRange, sourceRange, range] = waterMap;

				if (seedObj.fertilizer >= sourceRange && seedObj.fertilizer < (sourceRange + range)) {
					const diff = destRange - sourceRange;
					seedObj.water = seedObj.fertilizer + diff;
					break;
				}
			}

			// To light
			for (const lightMap of maps.waterToLight) {
				const [destRange, sourceRange, range] = lightMap;

				if (seedObj.water >= sourceRange && seedObj.water < (sourceRange + range)) {
					const diff = destRange - sourceRange;
					seedObj.light = seedObj.water + diff;
					break;
				}
			}

			// To temperature
			for (const temperatureMap of maps.lightToTemperature) {
				const [destRange, sourceRange, range] = temperatureMap;

				if (seedObj.light >= sourceRange && seedObj.light < (sourceRange + range)) {
					const diff = destRange - sourceRange;
					seedObj.temperature = seedObj.light + diff;
					break;
				}
			}

			// To humidity
			for (const humidityMap of maps.temperatureToHumidity) {
				const [destRange, sourceRange, range] = humidityMap;

				if (seedObj.temperature >= sourceRange && seedObj.temperature < (sourceRange + range)) {
					const diff = destRange - sourceRange;
					seedObj.humidity = seedObj.temperature + diff;
					break;
				}
			}

			// To location
			for (const locationMap of maps.humidityToLocation) {
				const [destRange, sourceRange, range] = locationMap;

				if (seedObj.humidity >= sourceRange && seedObj.humidity < (sourceRange + range)) {
					const diff = destRange - sourceRange;
					seedObj.location = seedObj.humidity + diff;
					break;
				}
			}

			seeds.push(seedObj);
		}

		// Sort the seeds by location and grab the lowest location
		seeds.sort((a, b) => a.location - b.location);
		result = seeds[0].location;

		// Print the result
		console.log(`Part 1 Result: ${result}`);
	});
}

function part2() {
	fs.open('input.txt', 'r', (err, fd) => {
		// Any variables
		// let result = 0;
		let result;

		const fileLines = [];

		for (const line of fs.readFileSync(fd, 'utf8').split('\n')) {
			fileLines.push(line);
		}

		const mapsRaw = [];
		for (let i = 1; i < fileLines.length; i++) {
			const map = [];
			const mapLines = [];
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
		const maps = {
			seedToSoil: mapsRaw[0],
			soilToFertilizer: mapsRaw[1],
			fertilizerToWater: mapsRaw[2],
			waterToLight: mapsRaw[3],
			lightToTemperature: mapsRaw[4],
			temperatureToHumidity: mapsRaw[5],
			humidityToLocation: mapsRaw[6],
		};

		// Parse the seed numbers
		// Seed line (first line) looks like this: "seeds: 79 14 55 13"
		// Each pair of nums has the first number as the start of the range and the second number as the amount of numbers in the range
		// So the first seed is 79 and the range is 14, so the range is 79-92
		// The second seed is 55 and the range is 13, so the range is 55-67
		const seedLine = fileLines[0].split(' ').map(Number).filter(Boolean);
		const seedRanges = [];
		for (let i = 0; i < seedLine.length; i += 2) {
			seedRanges.push([seedLine[i], seedLine[i + 1]]);
		}

		let locationLowest = Infinity;
		for (const seedRange of seedRanges) {
			const [start, range] = seedRange;
			for (let i = 0; i < range; i++) {
                if (i % 1000 === 0) console.log(i);
				const seed = start + i;
				const seedObj = {};
				seedObj.seed = seed;

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

					if (seedObj.soil >= sourceRange && seedObj.soil < (sourceRange + range)) {
						const diff = destRange - sourceRange;
						seedObj.fertilizer = seedObj.soil + diff;
						break;
					}
				}

				// To water
				for (const waterMap of maps.fertilizerToWater) {
					const [destRange, sourceRange, range] = waterMap;

					if (seedObj.fertilizer >= sourceRange && seedObj.fertilizer < (sourceRange + range)) {
						const diff = destRange - sourceRange;
						seedObj.water = seedObj.fertilizer + diff;
						break;
					}
				}

				// To light
				for (const lightMap of maps.waterToLight) {
					const [destRange, sourceRange, range] = lightMap;

					if (seedObj.water >= sourceRange && seedObj.water < (sourceRange + range)) {
						const diff = destRange - sourceRange;
						seedObj.light = seedObj.water + diff;
						break;
					}
				}

				// To temperature
				for (const temperatureMap of maps.lightToTemperature) {
					const [destRange, sourceRange, range] = temperatureMap;

					if (seedObj.light >= sourceRange && seedObj.light < (sourceRange + range)) {
						const diff = destRange - sourceRange;
						seedObj.temperature = seedObj.light + diff;
						break;
					}
				}

				// To humidity
				for (const humidityMap of maps.temperatureToHumidity) {
					const [destRange, sourceRange, range] = humidityMap;

					if (seedObj.temperature >= sourceRange && seedObj.temperature < (sourceRange + range)) {
						const diff = destRange - sourceRange;
						seedObj.humidity = seedObj.temperature + diff;
						break;
					}
				}

				// To location
				for (const locationMap of maps.humidityToLocation) {
					const [destRange, sourceRange, range] = locationMap;

					if (seedObj.humidity >= sourceRange && seedObj.humidity < (sourceRange + range)) {
						const diff = destRange - sourceRange;
						seedObj.location = seedObj.humidity + diff;
						break;
					}
				}

				if (seedObj.location < locationLowest) {
                    locationLowest = seedObj.location;
                    console.log("New lowest location:", locationLowest);
                }
                // console.log(seed)
			}
		}

		
		result = locationLowest;

		// Print the result
		console.log(`Part 1 Result: ${result}`);
	});
}

// part1();
part2();