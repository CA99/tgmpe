$(document).ready(function() {
	$('.controls button:nth-child(1)').click(function(){
		TGM.ig.stopGame();
		toggleSectionHeader();
	});

	$('.controls button:nth-child(2)').click(function() {
		if (TGM.ig.state == "stopped") {
			TGM.ig.startGame();
		}
		else if (TGM.ig.state == "paused") {
			TGM.ig.resumeGame();
		}
		else if (TGM.ig.state == "running") {
			TGM.ig.pauseGame();
		}
		else if (TGM.ig.state == "ended") {
			TGM.ig.stopGame();
			TGM.ig.startGame();
		}
		$('.controls button:nth-child(2)').displayPlayPause();

	});

	$('.controls button:nth-child(3)').click(function() {
		TGM.ig.stopGame();
	});

	$('.controls button:nth-child(4)').click(function() {

	});

});
