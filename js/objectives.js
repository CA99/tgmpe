// Objectives.js - Set objective-specific DOM controls
function setOutpostControls() {
	displayOutpostStatus(TGM.ig.outpost.owner);
	switch (TGM.cg.obj_teams) { // Disable team controls if outpost only usable by one team.
		case 'red':
			$('#btn_obj_action_blue_cap').remove();
		break;
		case 'blue':
			$('#btn_obj_action_red_cap').remove();
		break;
	}
	//$('.obj_action').bind('contextmenu', function(e) { return false; });
	$('.obj_action_cap').on('vmousedown',function() {
		if ($(this).attr('id') == 'btn_obj_action_red_cap') {
			if (TGM.ig.outpost.owner != 'neutral' && TGM.ig.outpost.owner != 'red' && TGM.cg.neutralize_first == 'on') {
				TGM.ig.outpost.startCapture('neutral');
			}
			else if (TGM.ig.outpost.owner != 'red') { TGM.ig.outpost.startCapture('red'); }
		}
		else if ($(this).attr('id') == 'btn_obj_action_blue_cap') {
			if (TGM.ig.outpost.owner != 'neutral' && TGM.ig.outpost.owner != 'blue' && TGM.cg.neutralize_first == 'on') {
				TGM.ig.outpost.startCapture('neutral');
			}
			else if (TGM.ig.outpost.owner != 'blue') { TGM.ig.outpost.startCapture('blue'); }
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
