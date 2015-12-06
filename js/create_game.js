$(document).ready(function() {
	$('.message').hide();
	$('#in_game .section-header').hideSection();


	$('#outpost_settings').append(TGM.templates.ctmpl_outpost_settings);
	$('#obj_type').change(function() {
		var type = $(this).val();
		$('.obj-settings').children('*').remove();
		if (type == 'outpost') {
			$('#outpost_settings').append(TGM.templates.ctmpl_outpost_settings);
		}
		else if (type == 'bomb') {
			$('#bomb_settings').append(TGM.templates.ctmpl_bomb_settings);
		}
		else {
			console.warn('Could not render objective settings.');
		}
	});


	$('#start_game').click(function() {
		event.preventDefault();
		// process form data and make it usable for game
		TGM.cg = $('#create_game_form').serializeObject();
		TGM.cg.timelimit = (
			parseInt(TGM.cg.timelimit_hrs)*3600 +
			parseInt(TGM.cg.timelimit_mins)*60 +
			parseInt(TGM.cg.timelimit_secs));
		delete TGM.cg.timelimit_hrs;
		delete TGM.cg.timelimit_mins;
		delete TGM.cg.timelimit_secs;

		TGM.cg.countoff =
			parseInt(TGM.cg.countoff_mins) * 60 +
			parseInt(TGM.cg.countoff_secs);
		delete TGM.cg.countoff_mins;
		delete TGM.cg.countoff_secs;


		if (TGM.cg.obj_type == 'bomb') {
			TGM.cg.bomb_timetick =
			parseInt(TGM.cg.bomb_timetick_mins) * 60 +
			parseInt(TGM.cg.bomb_timetick_secs);
		}
		delete TGM.cg.bomb_timetick_mins;
		delete TGM.cg.bomb_timetick_secs;

		// Render bomb or outpost objective in-game
		$('.obj-display').children('*').remove();
		TGM.ig.stopGame();
		if (TGM.cg.obj_type == 'outpost') {
			delete TGM.ig.bomb;
			TGM.ig.outpost = {
				owner: TGM.cg.outpost_start_team,
				contested: [0, 'neutral'], // State of outpost: [Progress, Team Contesting]
				capTimer: $.timer(function() {
					var max = TGM.cg.outpost_timecap * 100;
					if (TGM.ig.outpost.contested[1] != TGM.ig.outpost.owner) {
						if (TGM.ig.outpost.contested[0] < max) {
							TGM.ig.outpost.contested[0]++;
							var percentage = parseFloat(TGM.ig.outpost.contested[0] / max) * 100;
							setProgressBar(percentage);
						}
						else if (TGM.ig.outpost.contested[0] == max) {
							TGM.ig.outpost.capTimer.stop();
							TGM.ig.outpost.setOwner(TGM.ig.outpost.contested[1]);
							TGM.ig.incrementScore(TGM.ig.outpost.contested[1], 'outpost_capture');
							TGM.ig.outpost.contested = [0, 'neutral'];
							setProgressBar(0);
							if (TGM.cg.outpost_cap_once) {
								$('.button.obj_action').disable();
							}
						}
					}
				}),
				cooldownTimer: $.timer(function() {
					var max = TGM.cg.outpost_timecap * 100;
					if (TGM.ig.outpost.contested[1] != TGM.ig.outpost.owner) {
						if (TGM.ig.outpost.contested[0] > 0) {
							TGM.ig.outpost.contested[0]--;
							var percentage = parseFloat(TGM.ig.outpost.contested[0] / max) * 100;
							setProgressBar(percentage);
						}
						else if (TGM.ig.outpost.contested[0] == 0) {
							TGM.ig.outpost.cooldownTimer.stop();
							TGM.ig.outpost.contested[1] = 'neutral';
						}
					}
				}),
				startCapture: function(newOwner) {
					if (TGM.ig.outpost.contested[0] == 0 || TGM.ig.outpost.contested[1] == newOwner) {
						//TGM.cg.outpost_timecap;
						if (TGM.ig.outpost.cooldownTimer || TGM.ig.outpost.contested[1] == 'neutral') {
							if (TGM.ig.outpost.contested[1] == newOwner) {
								TGM.ig.outpost.cooldownTimer.stop();
							}
							TGM.ig.outpost.contested[1] = newOwner;
							TGM.ig.outpost.capTimer.set({
								time: 10,
								autostart: true
							});
						}
					}
					else {
						TGM.ig.outpost.capTimer.stop();
					}
				},
				stopCapture: function() {
					if (TGM.ig.outpost.contested[0] != 0) {
						TGM.ig.outpost.capTimer.stop();
						TGM.ig.outpost.cooldownTimer.set({
							time: 10,
							autostart: true
						});
					}
					else {
						TGM.ig.outpost.cooldownTimer.stop();
					}
				},
				setOwner: function(newOwner) {
					if (TGM.ig.outpost.scoreTimer) { TGM.ig.outpost.scoreTimer.stop(); }
					this.owner = newOwner;
					displayOutpostStatus(newOwner);
					if (newOwner != 'neutral') {
						var scoreTimerInterval = 1000;
						switch (TGM.cg.outpost_ownership_scoring_type) {
							case 'second':
								scoreTimerInterval = 1000;
							break;
							case 'minute':
								scoreTimerInterval = 60000;
							break;
						}
						TGM.ig.outpost.scoreTimer = $.timer(function() {
							TGM.ig.incrementScore(newOwner, 'outpost_ownership');
						});
						TGM.ig.outpost.scoreTimer.set({
							time: scoreTimerInterval,
							autostart: true
						});
					}
				}
			}
			$('#outpost_display').append(TGM.templates.ctmpl_outpost_objective);
			setOutpostControls();
		}
		else if (TGM.cg.obj_type == 'bomb') {
			delete TGM.ig.outpost_owner;
			TGM.ig.bomb = {
				state: 'ready',
				setState: function(newState) {
					console.log("set state of bomb objective to " + newState);
				}
			}
			$('#bomb_display').append(TGM.templates.ctmpl_bomb_objective);
			setBombControls();
		}
		else {
			console.warn('Could not render objective display.');
		}

		// reset data


		// set to in-game display
		toggleSectionHeader();
	});
});
