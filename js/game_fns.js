TGM.ig.startGame = function() {
	TGM.ig.time = TGM.cg.timelimit;
	TGM.ig.timer = $.timer(function() {
		if (TGM.ig.time > 0) {
			TGM.ig.time--;
			$('.time-ticker').text(numeral(TGM.ig.time).format('00:00:00'));
		}
		else {
			TGM.ig.endGame();
		}
	});

	TGM.ig.timer.set({
		time: 1000,
		autostart: false
	});
	TGM.ig.resumeGame();

	if (objKeyTest('TGM.ig.outpost')) { TGM.ig.outpost.setOwner(TGM.cg.outpost_start_team); }
	$('.button.obj_action').enable();
}

TGM.ig.stopGame = function() {
	if (TGM.ig.state == 'ended') {
		$('#btn_stop_refresh .fa').removeClass('fa-refresh').addClass('fa-stop');
	}
	TGM.ig.state = 'stopped';
	if (objKeyTest('TGM.ig.timer')) { TGM.ig.timer.stop(); }
	if (objKeyTest('TGM.ig.outpost')) {
		TGM.ig.outpost.setOwner(TGM.cg.outpost_start_team);
		if (objKeyTest('TGM.ig.outpost.scoreTimer')) {TGM.ig.outpost.scoreTimer.stop(); }
		if (TGM.ig.outpost.actionProgress[0] > 0) {
			TGM.ig.outpost.actionProgress = [0, 'neutral'];
			setProgressBar(0);
		}
	}
	if (objKeyTest('TGM.ig.bomb')) {
		TGM.ig.bomb.reset();
	}

	TGM.ig.resetScore();
	$('#status').text(TGM.text.stopped);
	$('.time-ticker').text(numeral(TGM.cg.timelimit).format('00:00:00'));
	$('#btn_play_pause').displayPlayPause();
	$('.button.obj_action').disable();
	$('#btn_play_pause').enable();
	$('.button.obj_action').prop('resumeEnable', false);
}

TGM.ig.resumeGame = function() {
	TGM.ig.state = 'running';
	TGM.ig.timer.play();
	$('#status').text(TGM.text.running);
	if (objKeyTest('TGM.ig.outpost')) {
		if (TGM.ig.outpost.actionProgress[0] > 0) { TGM.ig.outpost.cooldownTimer.play(); } //WIP
		if (TGM.ig.outpost.owner != 'neutral') { TGM.ig.outpost.scoreTimer.play(); }
	}
	if (objKeyTest('TGM.ig.bomb')) {
		if (TGM.ig.bomb.state == 'armed') { TGM.ig.bomb.fuseTimer.play(); }
		if (TGM.ig.bomb.actionProgress[0] != 0) { TGM.ig.bomb.actionTimer.play(); }
	}
	$('.button.obj_action').each(function() {
		if ($(this).prop('resumeEnable')) {
			$(this).prop('resumeEnable', false);
			$(this).enable();
		}
	});
}

TGM.ig.pauseGame = function() {
	TGM.ig.state = 'paused';
	TGM.ig.timer.pause();
	$('#status').text(TGM.text.paused);
	if (objKeyTest('TGM.ig.outpost')) {
		if (TGM.ig.outpost.actionProgress[0] > 0) {
			TGM.ig.outpost.stopCapture();
			TGM.ig.outpost.cooldownTimer.pause(); } //WIP
		if (TGM.ig.outpost.owner != 'neutral') { TGM.ig.outpost.scoreTimer.pause(); }
	}
	if (objKeyTest('TGM.ig.bomb')) {
		if (TGM.ig.bomb.state == 'armed') { TGM.ig.bomb.fuseTimer.pause(); }
		if (TGM.ig.bomb.actionProgress[0] != 0) { TGM.ig.bomb.actionTimer.pause(); }
	}
	$('.button.obj_action').each(function() {
		if (!$(this).prop('disabled')) {
			$(this).prop('resumeEnable', true);
			$(this).disable();
		}
	});
}

TGM.ig.endGame = function() {
	TGM.ig.state = 'ended';
	if (objKeyTest('TGM.ig.timer')) { TGM.ig.timer.stop(); }
	if (objKeyTest('TGM.ig.outpost.scoreTimer')) { TGM.ig.outpost.scoreTimer.stop(); }
	if (objKeyTest('TGM.ig.bomb.actionTimer')) { TGM.ig.bomb.actionTimer.stop(); }
	if (objKeyTest('TGM.ig.bomb.fuseTimer')) { TGM.ig.bomb.fuseTimer.pause(); }
	if (TGM.ig.score.sum() == 0) {
		$('#status').text(TGM.text.ended);
	}
	else if (TGM.ig.score.sum() > 0) {
		var winners = TGM.ig.score.highestIndexes();
		var statusText = TGM.text.ended;
		if (winners.length == 1) {
			if (winners[0] == 0) {
				statusText = TGM.text.ended + ': Red Team Wins';
			}
			else if (winners[0] == 1) {
				statusText = TGM.text.ended + ': Blue Team Wins';
			}
		}
		else if (winners.length == 2) {
			statusText = TGM.text.ended + ': Both Teams Tied';
		}
		$('#status').text(statusText);
	}
	$('#btn_play_pause').displayPlayPause();
	$('#btn_stop_refresh .fa').removeClass('fa-stop').addClass('fa-refresh');
	$('.button.obj_action').disable();
	$('#btn_play_pause').disable();
	$('.button.obj_action').prop('resumeEnable', false);
}

TGM.ig.incrementScore = function(team, type) {
	var incrementer = 1;
	var endGame = false;
	switch(type) {
		case 'outpost_capture':
			incrementer = TGM.cg.outpost_points_cap;
		break;
		case 'outpost_ownership':
			incrementer = TGM.cg.outpost_ownership_scoring;
		break;
		case 'bomb_arm':
			incrementer = TGM.cg.bomb_pointsarm;
		break;
		case 'bomb_disarm':
			incrementer = TGM.cg.bomb_pointsdiff;
		break;
		case 'bomb_detonate':
			incrementer = TGM.cg.bomb_pointsdet;
		break;
	}
	switch(team) {
		case 'red':
			TGM.ig.score[0] = parseInt(TGM.ig.score[0]) + parseInt(incrementer);
			$('#red_score').text(TGM.ig.score[0]);
			if (TGM.ig.score[0] >= TGM.cg.score_limit) {
				endGame = true;
			}
		break;
		case 'blue':
			TGM.ig.score[1] = parseInt(TGM.ig.score[1]) + parseInt(incrementer);
			$('#blue_score').text(TGM.ig.score[1]);
			if (TGM.ig.score[1] >= TGM.cg.score_limit) {
				endGame = true;
			}
		break;
	}
	if (endGame == true) { TGM.ig.endGame(); }
}

TGM.ig.resetScore = function() {
	for (i = 0; i < TGM.ig.score.length; i++) {
		TGM.ig.score[i] = 0;
	}
	$('.score-display').text('0');
}
