// Objectives.js - Set objective-specific DOM controls
function setOutpostControls() {
	displayOutpostStatus(TGM.ig.outpost.owner);
	switch (TGM.cg.obj_teams) { // Disable team controls if outpost only usable by one team.
		case 'red':
			$('#obj_action_blue_cap').remove();
		break;
		case 'blue':
			$('#obj_action_red_cap').remove();
		break;
	}
	//$('.obj_action').bind('contextmenu', function(e) { return false; });
	$('.obj_action_cap').on('vmousedown',function() {
		if ($(this).attr('id') == 'btn_obj_action_red_cap') {
			switch (TGM.ig.outpost.owner) {
				case 'blue':
					if (TGM.cg.neutralize_first == 'on') { TGM.ig.outpost.startCapture('neutral'); }
					else { TGM.ig.outpost.startCapture('red'); }
				break;
				case 'neutral':
					TGM.ig.outpost.startCapture('red');
				break;
			}
		}
		else if ($(this).attr('id') == 'btn_obj_action_blue_cap') {
			switch (TGM.ig.outpost.owner) {
				case 'red':
					if (TGM.cg.neutralize_first == 'on') { TGM.ig.outpost.startCapture('neutral'); }
					else { TGM.ig.outpost.startCapture('blue'); }
				break;
				case 'neutral':
					TGM.ig.outpost.startCapture('blue');
				break;
			}
		}
		$(this).on('vmouseup', function() {
			TGM.ig.outpost.stopCapture();
		});
		$(this).on('vmouseout', function() {
			TGM.ig.outpost.stopCapture();
		});
		//$(this).on('vmouseout', TGM.ig.outpost.stopCapture());
	});
	$('.button.obj_action').disable();
	//console.log('set outpost button stuff');
};

function setBombControls() {
	console.log('set bawb button stuff');
};
