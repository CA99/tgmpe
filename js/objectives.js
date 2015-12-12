// Objectives.js - Set objective-specific DOM controls
function setOutpostControls() {
	displayOutpostStatus(TGM.ig.outpost.owner);
	$('.obj_action, obj_controls').bind('contextmenu', function(e) { return false; });
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

		//$(this).on('vmouseout', TGM.ig.outpost.stopCapture());
	});
	$('.obj_action_cap').on('vmouseup', function() {
		TGM.ig.outpost.stopCapture();
		//console.log("stop capture vmu");
	});
	$('.obj_action_cap').on('vmouseout', function() {
		TGM.ig.outpost.stopCapture();
		//console.log("stop capture vmo");
	});
	//console.log('set outpost button stuff');
};

function setBombControls() {
	$('.obj_action_bomb').on('vmousedown',function() {
		if (TGM.ig.bomb.state == 'ready') {
			if ($(this).attr('id') == 'btn_obj_action_red_bomb') {
				TGM.ig.bomb.startArm('red');
			}
			else if ($(this).attr('id') == 'btn_obj_action_blue_bomb') {
				TGM.ig.bomb.startArm('blue');
			}

		}
	});
	$('.obj_action_bomb').on('vmouseup', function() {
		TGM.ig.bomb.stopArm();
	});
	$('.obj_action_bomb').on('vmouseout', function() {
		TGM.ig.bomb.stopArm();
	});
};

function setObjControls() {
	switch (TGM.cg.obj_teams) { // Disable team controls if outpost only usable by one team.
		case 'red':
			$('.obj_action').not('.obj_action_red').remove();
		break;
		case 'blue':
			$('.obj_action').not('.obj_action_blue').remove();
		break;
	}
	$('.button.obj_action').disable();
}
