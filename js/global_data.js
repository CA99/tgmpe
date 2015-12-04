TGM = { // namespace
	cg: {}, // create game
	ig: { // in-game
		state: "stopped", //stopped, running, paused, ended
		timer: 0,
		obj_timer: 0,
		startGame: "",
		score: [0, 0] // Red, Blue, Green, Yellow (only red/blue currently implemented)
	},
	templates: {}, // Handlebars templates
	text: { // Displayed text
		stopped: "Ready to Start Game",
		running: "Game in Progress",
		paused: "Game Paused",
		ended: "Game Over"
	}
}
