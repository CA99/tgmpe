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
		if (TGM.cg.obj_type == 'outpost') {
			$('#outpost_display').append(TGM.templates.ctmpl_outpost_objective);
		}
		else if (TGM.cg.obj_type == 'bomb') {
			$('#bomb_display').append(TGM.templates.ctmpl_bomb_objective);
		}
		else {
			console.warn('Could not render objective display.');
		}

		// reset data
		TGM.ig.stopGame();

		// set to in-game display
		toggleSectionHeader();
	});
});
