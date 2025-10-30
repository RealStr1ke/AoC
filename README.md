# Advent of Code

![Advent of Code Banner](assets/images/aoc-banner.jpeg)

Hi! This is my repository for my solutions to [Advent of Code](https://adventofcode.com/) challenges. 

## Usage

You can find my solutions in the [`events`](events) folder. Each yearly event has its own folder, and each day has its own folder within that. Each day folder contains the input I was given for the challenge and the program I made to calculate my solution (could be any language I choose). I'll also include a `README.md` file in each day folder that explains the challenge (with a link) and my solution whenever I get around to it (I am never getting around to it).

**Note:** If you see any gaps in the days, it's either because I haven't gotten around to solving it correctly, or I'm still rewriting it for readability. 

## CLI

***Note: `(year)` and `(day)` are optional parameters. If you don't provide them, the CLI will use the current year and day. However, if the current day isn't between December 1st and December 25th, the CLI will do nothing until you pass the `(year)` and `(day)` parameters.***

`aocs help` - Displays the help menu for the following commands.

`aocs autocomplete [bash|zsh|powershell]` - Generates autocomplete scripts for the given shell. If no shell is provided, it'll display setup instructions for autocomplete support.

`aocs commands` - Displays a list of available commands.

`aocs init (session)` - Initializes the Advent of Code CLI. This will create a `config.json` file in the root directory of this repository and prompt you to enter your session cookie in order to save it to that file. You can find your session cookie by logging into the Advent of Code website, opening the developer tools, going to the `Application` tab, and copying the value of the `session` cookie. If `(session)` is provided, it'll save that value to the `config.json` file instead of prompting you.

`aocs create (year) (day) [--input]` - Creates a new folder for the given year and day with the template `index.js` solution file, `input.txt` file, and `README.md` file with the challenge description. If `--input` is provided, it'll fetch the input for the given year and day and save it to the `input.txt` file instead of saving a blank input file.

`aocs input (year) (day) [--save]` - Displays the correct input for the given year and day. If `--save` is provided, it'll save the input to the `input.txt` file in the day's folder.

`aocs run (year) (day) -p [part]` - Runs the solution for the given year and day with the given part. This will save the result to the `config.json` file for later use. If no part is given, it runs both parts.

<!-- `aocs test (year) (day) -p [part]` - Runs the tests for the given year and day with the given part. If no part is given, it runs both parts. -->

`aocs view (year) (day) -p [part]` - Displays the challenge text for the given year and day. If no part is given, it'll display both parts.

`aocs submit (year) (day) [solution] -p [part]` - Submits the solution for the given year and day with the given part. If no solution is given, it'll use the solution saved in the `config.json` file.

`aocs leaderboard (year) (day) [--global] [--private <code>] [--list]` - Displays global points leaderboards, private leaderboards, completion times, and personal stats for Advent of Code challenges. Defaults to current year if not specified. Defaults to global points leaderboard if no flags are specified. **Note:** Global leaderboards are only available for years 2015-2024.

`aocs stats (year) [--global] [--personal]` - Displays the global completion stats for the given year. If no year is given, it'll display the stats for the current year. **Note:** Global stats are only available for years 2015-2024.

**Important:** Starting from 2025, Advent of Code events have 12 days instead of 25, and global leaderboards are no longer available. All commands have been updated to handle these changes automatically.

## Contributing

I'll most likely not be accepting pull requests to my solution code other than cleanup or optimization (maybe), but you may contribute to the repository by editing the `README.md` files. If you see a typo, something that could be worded better, or just innacuracies with the explanations, feel free to open a pull request with your changes. I'll review it and merge it if I like it. If you have a suggestion for a different solution to a challenge, you may open an issue and I'll take a look at it, but I won't be making new solution files, I'll probably just be explaning other routes to the solution in the `README.md` file.

## License

This project is licensed under the terms of the [MIT License](https://opensource.org/licenses/MIT).

---
