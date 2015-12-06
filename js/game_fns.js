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

	if (TGM.ig.outpost) { TGM.ig.outpost.setOwner(TGM.cg.outpost_start_team); }
	$('.button.obj_action').enable();
}

TGM.ig.stopGame = function() {
	if (TGM.ig.state == 'ended') {
		$('#btn_stop_refresh .fa').removeClass('fa-refresh').addClass('fa-stop');
	}
	TGM.ig.state = 'stopped';
	if (TGM.ig.timer) { TGM.ig.timer.stop(); }
	if (TGM.ig.outpost) {
		TGM.ig.outpost.setOwner(TGM.cg.outpost_start_team);
		if (TGM.ig.outpost.scoreTimer) {TGM.ig.outpost.scoreTimer.stop(); }
	}

	TGM.ig.resetScore();
	$('#status').text(TGM.text.stopped);
	$('.time-ticker').text(numeral(TGM.cg.timelimit).format('00:00:00'));
	$('#btn_play_pause').displayPlayPause();
	$('.button.obj_action').disable();
	$('#btn_play_pause').enable();
}

TGM.ig.resumeGame = function() {
	TGM.ig.state = 'running';
	TGM.ig.timer.play();
	$('#status').text(TGM.text.running);
	$('.button.obj_action').enable();
}

TGM.ig.pauseGame = function() {
	TGM.ig.state = 'paused';
	TGM.ig.timer.pause();
	$('#status').text(TGM.text.paused);
	$('.button.obj_action').disable();
	/*TGM.ig.timer = $.timer(function() {

	});*/

}

TGM.ig.endGame = function() {
	TGM.ig.state = 'ended';
	if (TGM.ig.timer) { TGM.ig.timer.stop(); }
	if (TGM.ig.outpost.scoreTimer) { TGM.ig.outpost.scoreTimer.stop(); }
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
