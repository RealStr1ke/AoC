import { Args, Command, Flags } from '@oclif/core';
import fs from 'fs';
import path from 'path';
// @ts-expect-error - I'm assuming statman-stopwatch isn't ESM compatible or whatever
import Stopwatch from 'statman-stopwatch';
import chalk from 'chalk';

interface TestCase {
	name: string;
	file: string;
	expected: {
		part1: number | null;
		part2: number | null;
	};
}

interface TestCases {
	cases: TestCase[];
}

interface TestResult {
	caseName: string;
	part1: {
		result: number;
		expected: number | null;
		passed: boolean | null; // null means no expected value
		time: number;
	} | null;
	part2: {
		result: number;
		expected: number | null;
		passed: boolean | null;
		time: number;
	} | null;
}

export default class Test extends Command {
	static summary = 'Run test cases for a challenge.';
	static description = 'Runs all test cases defined in tests/cases.json for the given year and day. Validates outputs against expected values and displays results with pass/fail indicators.';
	static hidden = false;
	static usage = 'aocs test (year) (day) [-p part] [--create]';
	static examples = [
		{
			command: 'aocs test 2024 3',
			description: 'Runs all test cases for Day 3 of 2024',
		},
		{
			command: 'aocs test 2024 3 -p 1',
			description: 'Runs only part 1 tests for Day 3 of 2024',
		},
		{
			command: 'aocs test 2024 3 --create',
			description: 'Creates test folder structure with test1.txt and cases.json',
		},
	];
	static strict = false;
	static hiddenAliases = [
		't',
	];
	static enableJsonFlag = false;

	static args = {
		year: Args.integer({
			description: 'The challenge\'s year',
		}),
		day: Args.integer({
			description: 'The challenge\'s day',
		}),
	};

	static flags = {
		part: Flags.string({
			char: 'p',
			description: 'The part of the challenge to test (1, 2, or both)',
		}),
		create: Flags.boolean({
			char: 'c',
			description: 'Create test folder structure if it doesn\'t exist',
		}),
	};

	private async runPart(solution: any, part: number, testFile: string, dayDir: string): Promise<{ result: number, time: number }> {
		const stopwatch = new Stopwatch();
		const testPath = path.join(dayDir, 'tests', testFile);
		
		const partFunc = solution.default[`part${part}`];
		
		// Check if function uses the new signature by inspecting its source code
		const funcString = partFunc.toString();
		const hasInputParam = funcString.includes('inputSource') || funcString.includes('input:') || (funcString.match(/function\s+\w+\s*\((\w+)\)/) && !funcString.includes('fs.readFileSync'));
		
		// If function doesn't accept input parameter, it uses old signature
		if (!hasInputParam || funcString.includes("fs.readFileSync(path.join(__dirname, 'input.txt')")) {
			throw new Error(`This solution uses the old signature and cannot be tested. Update part${part}() to accept optional input parameter:\n\nfunction part${part}(inputSource?: string | { file: string }): number {\n    let input: string;\n    if (!inputSource) {\n        input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');\n    } else if (typeof inputSource === 'string') {\n        input = inputSource;\n    } else {\n        input = fs.readFileSync(path.join(__dirname, inputSource.file), 'utf8');\n    }\n    // ... rest of solution\n}`);
		}
		
		// Read test data
		const testData = fs.readFileSync(testPath, 'utf8');
		
		stopwatch.start();
		let result: number;
		
		// Try new signature with file path first
		try {
			result = partFunc({ file: path.join('tests', testFile) });
		} catch (error) {
			// Try string input fallback
			try {
				result = partFunc(testData);
			} catch (error2) {
				stopwatch.stop();
				throw new Error(`Failed to run part${part} with test input: ${error2}`);
			}
		}
		
		stopwatch.stop();
		return { result, time: stopwatch.read() };
	}

	public async run(): Promise<void> {
		const { args, flags } = await this.parse(Test);
		const year = args.year ?? new Date().getFullYear();
		const day = args.day ?? (new Date().getMonth() === 11 ? new Date().getDate() : undefined);
		const explicit = {
			year: args.year !== undefined,
			day: args.day !== undefined,
		};

		// Validate the input
		if ((!explicit.year || !explicit.day) && day === undefined) {
			this.error('You must specify the year and day explicitly since the current month isn\'t December.');
		} else if (!explicit.day && day !== undefined && new Date().getDate() > (year >= 2025 ? 12 : 25)) {
			this.error(`You must specify the day explicitly since the current day is after the ${year >= 2025 ? 12 : 25}th.`);
		} else if (day !== undefined && (day > (year >= 2025 ? 12 : 25) || day < 1)) {
			this.error(`Day must be between 1 and ${year >= 2025 ? 12 : 25} for year ${year}. Your input: ${day}`);
		} else if (day === undefined) {
			this.error('You must specify the day explicitly since the current month isn\'t December.');
		} else if (flags.part && flags.part !== '1' && flags.part !== '2' && flags.part !== 'both') {
			this.error('Part must be either 1, 2 or both. Your input: ' + flags.part);
		}

		// Check if the challenge exists
		const dayDir = path.join(__dirname, '..', '..', 'events', year.toString(), 'days', day.toString());
		if (!fs.existsSync(dayDir)) {
			this.error(`The challenge folder for ${year} Day ${day} does not exist. Run 'aocs create ${year} ${day}' first.`);
		}

		const testsDir = path.join(dayDir, 'tests');
		const casesPath = path.join(testsDir, 'cases.json');

		// Handle --create flag
		if (flags.create) {
			if (!fs.existsSync(testsDir)) {
				fs.mkdirSync(testsDir, { recursive: true });
				this.log(chalk.green(`Created tests directory: ${testsDir}`));
			}

			if (!fs.existsSync(casesPath)) {
				const emptyCases: TestCases = {
					cases: [
						{
							name: 'Example 1',
							file: 'test1.txt',
							expected: {
								part1: null,
								part2: null,
							},
						},
					],
				};
				fs.writeFileSync(casesPath, JSON.stringify(emptyCases, null, 2));
				this.log(chalk.green(`Created cases.json with template`));
			}

			const test1Path = path.join(testsDir, 'test1.txt');
			if (!fs.existsSync(test1Path)) {
				fs.writeFileSync(test1Path, '');
				this.log(chalk.green(`Created test1.txt`));
			}

			this.log(chalk.green('\nTest structure created successfully!'));
			return;
		}

		// Check if tests directory and cases.json exist
		if (!fs.existsSync(testsDir)) {
			this.error(`Tests directory not found. Run 'aocs test ${year} ${day} --create' to create test structure.`);
		}

		if (!fs.existsSync(casesPath)) {
			this.error(`cases.json not found in tests directory. Run 'aocs test ${year} ${day} --create' to create test structure.`);
		}

		// Load test cases
		const testCasesData = fs.readFileSync(casesPath, 'utf8');
		const testCases: TestCases = JSON.parse(testCasesData);

		if (!testCases.cases || testCases.cases.length === 0) {
			this.error('No test cases defined in cases.json');
		}

		// Load the solution
		let indexPath = path.join(dayDir, 'index.ts');
		if (!fs.existsSync(indexPath)) {
			indexPath = path.join(dayDir, 'index.js');
			if (!fs.existsSync(indexPath)) {
				this.error(`No solution file found for ${year} Day ${day}.`);
			}
		}

		const solution = await import(indexPath);

		// Run tests
		this.log(chalk.bold.hex('#FDFD66')(`Running tests for Day ${day}, ${year}...\n`));

		const results: TestResult[] = [];
		const part = flags.part || 'both';

		for (const testCase of testCases.cases) {
			const testFilePath = path.join(testsDir, testCase.file);
			if (!fs.existsSync(testFilePath)) {
				this.log(chalk.red(`✗ Test file not found: ${testCase.file}`));
				continue;
			}

			this.log(chalk.cyan.bold(`Test: ${testCase.name}`));

			const result: TestResult = {
				caseName: testCase.name,
				part1: null,
				part2: null,
			};

			// Run part 1
			if (part === '1' || part === 'both') {
				const expected = testCase.expected.part1;
				if (expected === null) {
					this.log(`  Part 1: ${chalk.gray('disabled')}`);
				} else {
					try {
						const { result: res, time } = await this.runPart(solution, 1, testCase.file, dayDir);
						const passed = res === expected;

						result.part1 = { result: res, expected, passed, time };

						const icon = passed ? chalk.green('✓') : chalk.red('✗');
						const expectedStr = `(expected: ${chalk.yellow(expected)})`;
						this.log(`  Part 1: ${chalk.white(res)} ${expectedStr} ${icon}`);
					} catch (error) {
						this.log(chalk.red(`  Part 1: Error - ${error}`));
					}
				}
			}

			// Run part 2
			if (part === '2' || part === 'both') {
				const expected = testCase.expected.part2;
				if (expected === null) {
					this.log(`  Part 2: ${chalk.gray('disabled')}`);
				} else {
					try {
						const { result: res, time } = await this.runPart(solution, 2, testCase.file, dayDir);
						const passed = res === expected;

						result.part2 = { result: res, expected, passed, time };

						const icon = passed ? chalk.green('✓') : chalk.red('✗');
						const expectedStr = `(expected: ${chalk.yellow(expected)})`;
						this.log(`  Part 2: ${chalk.white(res)} ${expectedStr} ${icon}`);
					} catch (error) {
						this.log(chalk.red(`  Part 2: Error - ${error}`));
					}
				}
			}

			// Show time
			const times: string[] = [];
			if (result.part1) times.push(`Part 1: ${result.part1.time.toPrecision(3)}ms`);
			if (result.part2) times.push(`Part 2: ${result.part2.time.toPrecision(3)}ms`);
			if (times.length > 0) {
				this.log(chalk.gray(`  Time: ${times.join(', ')}`));
			}
			this.log();

			results.push(result);
		}

		// Summary
		let passed = 0;
		let failed = 0;
		let total = 0;

		for (const result of results) {
			if (result.part1) {
				total++;
				if (result.part1.passed) passed++;
				else if (result.part1.passed === false) failed++;
			}
			if (result.part2) {
				total++;
				if (result.part2.passed) passed++;
				else if (result.part2.passed === false) failed++;
			}
		}

		if (total > 0) {
			this.log(chalk.bold('Results:'));
			if (passed > 0) this.log(chalk.green(`  ✓ ${passed}/${total} passed`));
			if (failed > 0) this.log(chalk.red(`  ✗ ${failed}/${total} failed`));
		}
	}
}
