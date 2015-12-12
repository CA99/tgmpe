TGM = { // namespace
	cg: {}, // create game: populated by form serialization and additional processing - create_game.js: 12

	ig: { // in-game
		state: "stopped", //stopped, running, paused, ended
		timer: 0,
		obj_timer: 0,
		countoff: 0,
		startGame: "",
		score: [0, 0], // Red, Blue, Green, Yellow (only red/blue currently implemented)
		//outpost: {},
		//bomb: {}
		/*getOpposingTeam: function(team) {
			switch (team) {
				case 'red':
					return 'blue';
				break;
				case 'blue':
					return 'red';
				break;
			}
		}*/
	},
	templates: {}, // Handlebars templates
	text: { // Displayed text
		stopped: "Ready to Start",
		running: "Game in Progress",
		paused: "Game Paused",
		ended: "Game Over",
		neutral_outpost: "Neutral Outpost",
		red_outpost: "Red Team Outpost",
		blue_outpost: "Blue Team Outpost",
		ready_bomb: "Ready to Arm",
		armed_bomb: "Bomb Armed",
		disarmed_bomb: "Bomb Disarmed",
		arming_bomb: "Arming...",
		disarming_bomb: "Disarming...",
		detonated_bomb: "Bomb Detonated"
	}
}
