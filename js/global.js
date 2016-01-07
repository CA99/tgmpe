TGM = { // namespace
	cg: {}, // create game: populated by form serialization and additional processing - create_game.js: 12

	ig: { // in-game
		state: "stopped", //stopped, running, paused, ended
		countoff_counter: 0,
		countoff_timer: $.timer(function() {
			if (TGM.ig.countoff_counter > 0) {
				TGM.ig.countoff_counter--;
				$('#status').text(TGM.text.countoff +
					numeral(parseInt(TGM.ig.countoff_counter))
					.format('00:00'));
			}
			else {
				TGM.ig.countoff_timer.stop();
				TGM.ig.startGame();
			}
		}),
		timer: 0,
		obj_timer: 0,
		startGame: "",
		score: [0, 0], // Red, Blue, Green, Yellow (only red/blue currently implemented)
		//outpost: {},
		//bomb: {}
		getOpposingTeam: function(team) {
			switch (team) {
				case 'red':
					return 'blue';
				break;
				case 'blue':
					return 'red';
				break;
			}
		}/*,
		countoff_timer: {},
		countoff_counter: 0

		*/
	},
	//sg{}, // saved game
	templates: {}, // Handlebars templates
	text: { // Displayed text
		stopped: "Ready to Start",
		countoff: "Game starts in ",
		running: "Game in Progress",
		paused: "Game Paused",
		ended: "Game Over",
		neutral_outpost: "Neutral Outpost",
		red_outpost: "Red Team Outpost",
		blue_outpost: "Blue Team Outpost",
		ready_bomb: "Waiting...",
		armed_bomb: "Bomb Has Been Planted",
		disarmed_bomb: "Bomb Has Been Diffused",
		arming_bomb: "Planting...",
		disarming_bomb: "Diffusing...",
		detonated_bomb: "Bomb Detonated"
	}
}
