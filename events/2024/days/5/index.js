import fs from 'fs';
import path from 'path';

function checkUpdate(update, rules) {
	for (const rule of rules) {
		if (update.includes(rule[0]) && update.includes(rule[1])) {
			const index1 = update.indexOf(rule[0]);
			const index2 = update.indexOf(rule[1]);

			if (index1 > index2) return false;
		}
	}

	return true;
}

function reorderUpdate(update, rules) {
	if (checkUpdate(update, rules)) return update;

	let newUpdate = [];

	for (let i = 0; i < update.length; i++) {
		if (i === 0) {
			newUpdate.push(update[i]);
		} else {
			for (let j = 0; j <= newUpdate.length; j++) {
				const tempUpdate = newUpdate.slice();
				tempUpdate.splice(j, 0, update[i]);

				const status = checkUpdate(tempUpdate, rules);
				if (status) {
					newUpdate = tempUpdate;
					break;
				}
			}
		}
	}
	return newUpdate;
}

function part1() {
	const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result = 0;

	const [rules, updates] = data.split('\n\n').map(x => x.split('\n'));

	for (let i = 0; i < rules.length; i++) {
		const rule = rules[i];
		const [num1, num2] = rule.split('|').map(Number);
		rules[i] = [num1, num2];
	}
	for (let i = 0; i < updates.length; i++) {
		updates[i] = updates[i].split(',').map(Number);
	}


	for (const update of updates) {
		const status = checkUpdate(update, rules);
		if (status) result += update[Math.floor(update.length / 2)];
	}

	return result;
}

function part2() {
	const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result = 0;

	const [rules, updates] = data.split('\n\n').map(x => x.split('\n'));

	for (let i = 0; i < rules.length; i++) {
		const rule = rules[i];
		const [num1, num2] = rule.split('|').map(Number);
		rules[i] = [num1, num2];
	}
	for (let i = 0; i < updates.length; i++) {
		updates[i] = updates[i].split(',').map(Number);
	}


	for (let i = 0; i < updates.length; i++) {
		const update = updates[i];
		const status = checkUpdate(update, rules);
		if (!status) {
			// console.log(`Update ${update} is not correct`);
			const newUpdate = reorderUpdate(update, rules);
			// console.log('Reordered update: ', newUpdate);
			result += newUpdate[Math.floor(newUpdate.length / 2)];
		}
	}

	return result;
}

// console.log(`Part 1: ${part1()}`);
// console.log(`Part 2: ${part2()}`);

export default {
	part1,
	part2,
};