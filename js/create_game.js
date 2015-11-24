$(document).ready(function() {
	$('.message').hide();
	$('#in_game .section-header').hideSection();
	TGM.templates.ctmpl_outpost_settings = Handlebars.compile($('#tmpl_outpost_settings').html());
	TGM.templates.ctmpl_bomb_settings = Handlebars.compile($('#tmpl_bomb_settings').html());

	$('#outpost_settings').append(TGM.templates.ctmpl_outpost_settings);
	$('#obj_type').change(function() {
		var type = $(this).val();
		$('.obj-settings').each(function() {
			var thisID = $(this).attr('id');
			var thisType = thisID.replace( /_settings/g, '' );
			if (thisType != type) {
				$(this).children('*').remove();
			}
		});
		renderObjectiveSettings(type);
	});


	$('#start_game').click(function() {
		event.preventDefault();
		TGM.cg = $('#create_game_form').serializeObject();
		TGM.cg.timelimit = (
			parseInt(TGM.cg.timelimit_hrs)*3600 +
			parseInt(TGM.cg.timelimit_mins)*60 +
			parseInt(TGM.cg.timelimit_secs));
		delete TGM.cg.timelimit_hrs;
		delete TGM.cg.timelimit_mins;
		delete TGM.cg.timelimit_secs;
		if (TGM.cg.obj_type == 'bomb') {
			TGM.cg.bomb_timetick =
			parseInt(TGM.cg.bomb_timetick.mins) * 60 +
			parseInt(TGM.cg.bomb_timetick_secs);
		}
		console.log(TGM.cg.timelimit);
		TGM.ig = TGM.cg;
		console.log(TGM.ig);
		//toggleSectionHeader();
		//startGame();
	});
});
