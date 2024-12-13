import fs from 'fs';

function isNum(char) {
	return char.match(/[0-9]/);
}

function part1() {
	fs.open('input.txt', 'r', (err, fd) => {
		// Any variables
		let result = 1;
		// let result;

		const lines = fs.readFileSync(fd, 'utf8').split('\n');
		const times = lines[0].split(' ').map(Number).filter(Boolean);
		const distances = lines[1].split(' ').map(Number).filter(Boolean);

		const currentWRs = [];
		for (let i = 0; i < times.length; i++) {
			currentWRs.push({ time: times[i], distance: distances[i] });
		}

		for (let i = 0; i < currentWRs.length; i++) {
			// Calculate all the ways you could beat those WRs
			// Split the time into the part where you press the button and the part afterwards and the boat is moving
			const time = currentWRs[i].time;
			const distance = currentWRs[i].distance;

			// Calculate all possible runs
			const possibleRuns = [];
			for (let j = 0; j < time; j++) {
				const posButton = j;
				const posBoat = posButton * (time - posButton);
				possibleRuns.push({ time: time, distance: posBoat });
			}

			// Find the amount of runs with the same time that beats the distance WR
			let runsThatBeatWR = 0;
			for (const run of possibleRuns) {
				if (run.distance > distance) {
					runsThatBeatWR++;
				}
			}

			// Multiply the result by the amount of runs that beat the WR
			result *= runsThatBeatWR;

		}

		// Print the result
		console.log(`Part 1 Result: ${result}`);
	});
}

function part2() {
	fs.open('input.txt', 'r', (err, fd) => {
		// Any variables
		let result = 0;
		// let result;

		const lines = fs.readFileSync(fd, 'utf8').split('\n');
		const times = lines[0].split('');
		const distances = lines[1].split('');
		let mainTime = '';
		let mainDistance = '';
		for (let i = 0; i < times.length; i++) {
			if (isNum(times[i])) mainTime += times[i];
		}
		for (let i = 0; i < distances.length; i++) {
			if (isNum(distances[i])) mainDistance += distances[i];
		}

		mainTime = Number(mainTime);
		mainDistance = Number(mainDistance);
		// console.log(mainTime, mainDistance)


		const currentWRs = [];
		currentWRs.push({ time: mainTime, distance: mainDistance });

		let runsThatBeatWR = 0;
		for (let i = 0; i < currentWRs.length; i++) {
			// Calculate all the ways you could beat those WRs
			// Split the time into the part where you press the button and the part afterwards and the boat is moving
			const time = currentWRs[i].time;
			const distance = currentWRs[i].distance;

			// Calculate all possible runs
			const possibleRuns = [];
			for (let j = 0; j < time; j++) {
				const posButton = j;
				const posBoat = posButton * (time - posButton);
				if (posBoat > distance) {
					runsThatBeatWR++;
				}
			}

			result += runsThatBeatWR;

		}

		// Print the result
		console.log(`Part 2 Result: ${result}`);
	});
}

export default {
	part1,
	part2,
};