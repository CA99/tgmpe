$(document).ready(function() {
	$('#btn_back').click(function() {
		backToCG();
	});

	$('#btn_play_pause').click(function() {
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
		$('#btn_play_pause').displayPlayPause();

	});

	$('#btn_stop_refresh').click(function() {
		TGM.ig.stopGame();
	});

	$('#btn_audio').click(function() {

	});

});
