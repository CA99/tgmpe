function toggleSectionHeader() {
	$('.section-header').each(function() {
		var $dropIcon = $(this).children('.fa');
		if ($dropIcon.hasClass('fa-chevron-down')) {
			$(this).hideSection()
		}
		else {
			$(this).showSection();
		}
	});
}

function renderObjectiveSettings(type) {
	if (type == 'outpost') {
		$('#outpost_settings').append(TGM.templates.ctmpl_outpost_settings);
	}
	else if (type == 'bomb') {
		$('#bomb_settings').append(TGM.templates.ctmpl_bomb_settings);
	}
	else {
		console.warn('Could not render objective settings.')
	}
}


$.fn.showSection = function() {
	var $dropIcon = this.children('.fa');
	$dropIcon.removeClass('fa-chevron-right');
	$dropIcon.addClass('fa-chevron-down');
	this.siblings('*').show();
}

$.fn.hideSection = function() {
	var $dropIcon = this.children('.fa');
	$dropIcon.removeClass('fa-chevron-down');
	$dropIcon.addClass('fa-chevron-right');
	this.siblings('*').hide();
}

$.fn.displayPlayPause = function() {
	var $icon = $(this).children('i');
	if (TGM.ig.state == 'running') {
		$icon.removeClass('fa-play').addClass('fa-pause');

	}
	else if (TGM.ig.state == 'stopped' || TGM.ig.state == 'paused' || TGM.ig.state == 'ended') {
		$icon.removeClass('fa-pause').addClass('fa-play');

	}
}
