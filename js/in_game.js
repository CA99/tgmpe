$(document).ready(function() {
	$('#game_controls button:nth-child(1)').click(function() {
		backToCG();
	});

	$('#game_controls button:nth-child(2)').click(function() {
		if (TGM.ig.state == 'stopped') {
			TGM.ig.startGame();
		}
		else if (TGM.ig.state == 'paused') {
			TGM.ig.resumeGame();
		}
		else if (TGM.ig.state == 'running') {
			TGM.ig.pauseGame();
		}
		else if (TGM.ig.state == 'ended') {
			TGM.ig.stopGame();
			TGM.ig.startGame();
		}
		$('#game_controls button:nth-child(2)').displayPlayPause();

	});

	$('#game_controls button:nth-child(3)').click(function() {
		TGM.ig.stopGame();
	});

	$('#game_controls button:nth-child(4)').click(function() {

	});

});
