$(document).ready(function() {
	TGM.templates.ctmpl_outpost_settings = Handlebars.compile($('#tmpl_outpost_settings').html());
	TGM.templates.ctmpl_bomb_settings = Handlebars.compile($('#tmpl_bomb_settings').html());
	TGM.templates.ctmpl_outpost_objective = Handlebars.compile($('#tmpl_outpost_objective').html());
	TGM.templates.ctmpl_bomb_objective = Handlebars.compile($('#tmpl_bomb_objective').html());
});

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

function backToCG() {
	TGM.ig.stopGame();
	toggleSectionHeader();
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
