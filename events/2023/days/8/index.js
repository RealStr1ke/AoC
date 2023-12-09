const fs = require('fs');

function part1() {
	fs.open('input.txt', 'r', (err, fd) => {
		// Any variables
		let result = 0;
		// let result;

		const rawLines = fs.readFileSync(fd, 'utf8').split('\n');

		const turns = rawLines[0].split('');
		// console.log(turns);

		const routes = {};
		// Parse the rest of the input
		for (let i = 2; i < rawLines.length; i++) {
			// Lines look like this: "XXX = (YYY, ZZZ)"
			// Where XXX is the current location
			// YYY is the location on the left
			// ZZZ is the location on the right

			// Split the line into the current location and the locations on the left and right
			const line = rawLines[i].split(' = ');
			const currentLocation = line[0];
			const leftRight = line[1].split(', ').map(x => x.replace('(', '').replace(')', ''));

			// Add the current location to the routes object
			routes[currentLocation] = {
				left: leftRight[0],
				right: leftRight[1],
			};
		}
		// console.log(routes)

		let currentLocation = 'AAA';
		let index = 0;
		let totalTurns = 0;
		while (currentLocation !== 'ZZZ') {
			if (index === turns.length) index = 0;
			const turn = turns[index];
			const currentRoute = routes[currentLocation];
			if (turn === 'L') currentLocation = currentRoute.left;
			else if (turn === 'R') currentLocation = currentRoute.right;
			index++;
			totalTurns++;
			if (currentLocation === 'ZZZ') result = totalTurns;
			console.log(`Turned ${turn} to ${currentLocation}`);
		}

		// while (currentLocation !== "ZZZ") {
		//     if (index === turns.length) {
		//         index = 0;
		//     }
		//     let turn = turns[index];
		//     let currentRoute = routes[currentLocation];
		//     if (turn === 'L') {
		//         currentLocation = currentRoute.left;
		//     } else if (turn === 'R') {
		//         currentLocation = currentRoute.right;
		//     }
		//     if (currentLocation === 'ZZZ') {
		//         result = totalTurns;
		//     }
		//     index++;
		//     totalTurns++;
		//     console.log(`Turned ${turn} to ${currentLocation}`)
		// }
		// for (let i = 0; i < turns.length; i++) {
		//     let turn = turns[i];
		//     let currentRoute = routes[currentLocation];
		//     if (turn === 'L') {
		//         console.log(currentRoute.left)
		//         currentLocation = currentRoute.left;
		//     } else if (turn === 'R') {
		//         console.log(currentRoute.right)
		//         currentLocation = currentRoute.right;
		//     }
		//     if (currentLocation === 'ZZZ') {
		//         result = i + 1;
		//         break;
		//     }
		// }

		// Print the result
		console.log(`Part 1 Result: ${result}`);
	});
}

function part2() {
	fs.open('input.txt', 'r', (err, fd) => {
		// Any variables
		let result = 0;
		// let result;

		const rawLines = fs.readFileSync(fd, 'utf8').split('\n');

		const turns = rawLines[0].split('');
		// console.log(turns);

		const routes = {};
		// Parse the rest of the input
		for (let i = 2; i < rawLines.length; i++) {
			// Lines look like this: "XXX = (YYY, ZZZ)"
			// Where XXX is the current location
			// YYY is the location on the left
			// ZZZ is the location on the right

			// Split the line into the current location and the locations on the left and right
			const line = rawLines[i].split(' = ');
			const currentLocation = line[0];
			const leftRight = line[1].split(', ').map(x => x.replace('(', '').replace(')', ''));

			// Add the current location to the routes object
			routes[currentLocation] = {
				left: leftRight[0],
				right: leftRight[1],
			};
		}
		// console.log(routes)

		// Find all the locations that end with A
		const locationsA = Object.keys(routes).filter(x => x.endsWith('A'));
		// Find all the locations that end with Z
		const locationsZ = Object.keys(routes).filter(x => x.endsWith('Z'));

		// For each location that ends with A, find the shortest path to a location that ends with Z
		const shortestPaths = [];

		for (let i = 0; i < locationsA.length; i++) {
			console.log('Finding shortest path for ' + locationsA[i] + `(${i + 1}/${locationsA.length})`);
			let currentLocation = locationsA[i];
			let index = 0;
			let totalTurns = 0;
			while (!locationsZ.includes(currentLocation)) {
				if (index === turns.length) index = 0;
				const turn = turns[index];
				const currentRoute = routes[currentLocation];
				if (turn === 'L') currentLocation = currentRoute.left;
				else if (turn === 'R') currentLocation = currentRoute.right;
				index++;
				totalTurns++;
				// if (currentLocation === 'ZZZ') result = totalTurns;
				// console.log(`Turned ${turn} to ${currentLocation}`)
			}
			shortestPaths.push(totalTurns);
		}

		// Find the LCM of the values in shortestPaths
		function gcd(a, b) {
			return !b ? a : gcd(b, a % b);
		}
		function lcm(a, b) {
			return (a * b) / gcd(a, b);
		}
		result = shortestPaths.reduce(lcm);

		// console.log(shortestPaths)

		// Print the result
		console.log(`Part 2 Result: ${result}`);
	});
}

module.exports = {
    part1,
    part2
};