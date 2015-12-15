$(document).ready(function() {
	$('.message').hide();
	$('#in_game .section-header').hideSection();

	renderObjSettings($('#obj_type').val());

	$('#obj_type').change(function() {
		var type = $(this).val();
		renderObjSettings(type);
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
			TGM.cg.bomb_timedet =
			parseInt(TGM.cg.bomb_timedet_mins) * 60 +
			parseInt(TGM.cg.bomb_timedet_secs);
		}
		delete TGM.cg.bomb_timedet_mins;
		delete TGM.cg.bomb_timedet_secs;

		// Render bomb or outpost objective in-game
		$('.obj-display').children('*').remove();
		TGM.ig.stopGame();
		if (TGM.cg.obj_type == 'outpost') {
			if (TGM.ig.bomb) { delete TGM.ig.bomb; }
			TGM.ig.outpost = {
				owner: TGM.cg.outpost_start_team,
				actionProgress: [0, 'neutral'], // State of outpost: [Progress, Team Contesting]
				capTimer: $.timer(function() {
					var max = TGM.cg.outpost_timecap * 10; // 10 stutter, 100 smooth
					if (TGM.ig.outpost.actionProgress[1] != TGM.ig.outpost.owner) {
						if (TGM.ig.outpost.actionProgress[0] < max) {
							TGM.ig.outpost.actionProgress[0]++;
							var percentage = parseFloat(TGM.ig.outpost.actionProgress[0] / max) * 100;
							setProgressBar(percentage);
						}
						else if (TGM.ig.outpost.actionProgress[0] == max) {
							TGM.ig.outpost.capTimer.stop();
							TGM.ig.outpost.setOwner(TGM.ig.outpost.actionProgress[1]);
							TGM.ig.incrementScore(TGM.ig.outpost.actionProgress[1], 'outpost_capture');
							TGM.ig.outpost.actionProgress = [0, 'neutral'];
							setProgressBar(0);
							if (TGM.cg.outpost_cap_once) {
								$('.button.obj_action').disable();
							}
						}
					}
				}),
				cooldownTimer: $.timer(function() {
					var max = TGM.cg.outpost_timecap * 10; // 10 stutter, 100 smooth
					if (TGM.ig.outpost.actionProgress[1] != TGM.ig.outpost.owner) {
						if (TGM.ig.outpost.actionProgress[0] > 0) {
							TGM.ig.outpost.actionProgress[0]--;
							var percentage = parseFloat(TGM.ig.outpost.actionProgress[0] / max) * 100; //
							setProgressBar(percentage);
						}
						else if (TGM.ig.outpost.actionProgress[0] == 0) {
							TGM.ig.outpost.cooldownTimer.stop();
							TGM.ig.outpost.actionProgress[1] = 'neutral';
						}
					}
				}),
				startCapture: function(newOwner) {
					if (TGM.ig.outpost.actionProgress[0] == 0 || TGM.ig.outpost.actionProgress[1] == newOwner) {
						//TGM.cg.outpost_timecap;
						if (TGM.ig.outpost.cooldownTimer || TGM.ig.outpost.actionProgress[1] == 'neutral') {
							if (TGM.ig.outpost.actionProgress[1] == newOwner) {
								TGM.ig.outpost.cooldownTimer.stop();
							}
							TGM.ig.outpost.actionProgress[1] = newOwner;
							TGM.ig.outpost.capTimer.set({
								time: 100, // 100 stutter, 10 smooth
								autostart: true
							});
						}
					}
					else {
						TGM.ig.outpost.capTimer.stop();
					}
				},
				stopCapture: function() {
					if (TGM.ig.outpost.actionProgress[0] != 0) {
						TGM.ig.outpost.capTimer.stop();
						TGM.ig.outpost.cooldownTimer.set({
							time: 100, // 100 stutter, 10 smooth
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
			setObjControls();
			setOutpostControls();
		}
		else if (TGM.cg.obj_type == 'bomb') {
			if (TGM.ig.outpost) { delete TGM.ig.outpost; }
			var objTeam = 'neutral';
			if (TGM.cg.obj_teams_blue) { objTeam = 'blue' }
			else if (TGM.cg.obj_teams_red) { objTeam = 'red' }
			TGM.ig.bomb = {
				state: 'ready',
				team: objTeam,
				actionProgress: [0, 'neutral', 'waiting'],
				actionTimer: $.timer(function() {
					console.log('actiontimer');
					switch (TGM.ig.bomb.state) {
						case 'ready':
							var max = TGM.cg.bomb_timearm * 10; // 10 stutter, 100 smooth
						break;
						case 'armed':
							var max = TGM.cg.bomb_timediff * 10; // 10 stutter, 100 smooth
						break;
					}
					if (TGM.ig.bomb.state == 'ready' || TGM.ig.bomb.state == 'armed') {
						if (TGM.ig.bomb.actionProgress[2] == 'start') {
							if (TGM.ig.bomb.actionProgress[0] < max) {
								TGM.ig.bomb.actionProgress[0]++;
							}
							else if (TGM.ig.bomb.actionProgress[0] == max) {
								if (TGM.ig.bomb.state == 'ready') { TGM.ig.bomb.arm(TGM.ig.bomb.actionProgress[1]); }
								else if (TGM.ig.bomb.state == 'armed') { TGM.ig.bomb.disarm(); }
								TGM.ig.bomb.actionTimer.stop();
								TGM.ig.bomb.actionProgress = [0, 'neutral', 'waiting'];
							}
						}
						if (TGM.ig.bomb.actionProgress[2] == 'stop') {
							if (TGM.ig.bomb.actionProgress[0] > 0) {
								TGM.ig.bomb.actionProgress[0]--;
							}
							else if (TGM.ig.bomb.actionProgress[0] == 0) {
								TGM.ig.bomb.actionTimer.stop();
								TGM.ig.bomb.actionProgress[0] = 0;
							}
						}
						var percentage = parseFloat(TGM.ig.bomb.actionProgress[0] / max) * 100;
						setProgressBar(percentage);
					}
				}),
				fuseTimer: $.timer(function() {
					// on each tick, run TGM.ig.bomb.tick()!
				}),
				fuse: TGM.cg.bomb_timedet,
				startAction: function(team) {
					console.log('start-action: ' + team);
					TGM.ig.bomb.actionProgress[1] = team;
					TGM.ig.bomb.actionProgress[2] = 'start';
					TGM.ig.bomb.actionTimer.set({
						time: 100, // 100 stutter, 10 smooth
						autostart: true
					});
				},
				stopAction: function(team) {
					console.log('stop-action');
					TGM.ig.bomb.actionProgress[2] = 'stop';
				},
				arm: function(team) {
					console.log('armed ' + team);
					TGM.ig.bomb.state = 'armed';
					TGM.ig.bomb.team = team;

				},
				disarm: function(team) {
					console.log('disarmed ' + team);
					TGM.ig.bomb.state = 'disarmed';
					TGM.ig.bomb.team = team;
					TGM.ig.bomb.fuse = TGM.cg.bomb_timedet;
				},
				detonate: function() {
					console.log('detonated');
				},
				setState: function(newState) {
					console.log("set state of bomb objective to " + newState);
					TGM.ig.bomb.state = newState;
				},
				tick: function() {
					console.log('tick'); // should flash and make beep sound
					$('#prog_bomb').addClass('flash');
					setTimeout(function() {
						$('#prog_bomb').removeClass('flash');
					}, 200);
				}
			}
			$('#bomb_display').append(TGM.templates.ctmpl_bomb_objective);
			setObjControls();
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
