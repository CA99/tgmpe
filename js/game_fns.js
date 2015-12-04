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
}

TGM.ig.stopGame = function() {
	TGM.ig.state = "stopped";
	if (TGM.ig.timer) { TGM.ig.timer.stop(); }
	$('.status').text(TGM.text.stopped);
	$('.time-ticker').text(numeral(TGM.cg.timelimit).format('00:00:00'));
	$('.controls button:nth-child(2)').displayPlayPause();
	/*TGM.ig.timer = $.timer(function() {

	});*/
}

TGM.ig.resumeGame = function() {
	TGM.ig.state = "running";
	TGM.ig.timer.play();
	$('.status').text(TGM.text.running);
}

TGM.ig.pauseGame = function() {
	TGM.ig.state = "paused";
	TGM.ig.timer.pause();
	$('.status').text(TGM.text.paused);
	/*TGM.ig.timer = $.timer(function() {

	});*/

}

TGM.ig.endGame = function() {
	TGM.ig.state = "ended";
	if (TGM.ig.timer) { TGM.ig.timer.stop(); }
	if (TGM.ig.score.sum() == 0) {
		$('.status').text(TGM.text.ended);
	}
	else if (TGM.ig.score.sum() > 0) {
		var winners = TGM.ig.score.highestIndexes();
		var statusText = TGM.text.ended;
		if (winners.length == 1) {
			if (winners[0] == 0) {
				statusText = TGM.text.ended + ": Red Team Wins";
			}
			else if (winners[0] == 1) {
				statusText = TGM.text.ended + ": Blue Team Wins";
			}
		}
		else if (winners.length == 2) {
			statusText = TGM.text.ended + ": Both Teams Tied";
		}
		$('.status').text(statusText);
	}
	$('.controls button:nth-child(2)').displayPlayPause();
}

TGM.ig.incrementScore = function(team, type) {

}
