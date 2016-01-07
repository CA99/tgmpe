function render(tmpl_name, tmpl_data) {

	if ( !render.tmpl_cache ) {
		render.tmpl_cache = {};
	}

	if ( ! render.tmpl_cache[tmpl_name] ) {
		var tmpl_dir = '';
		var tmpl_url = tmpl_dir + '/' + tmpl_name + '.hbs';
		var tmpl_string;
		$.ajax({
			url: tmpl_url,
			dataType: 'html',
			method: 'GET',
			async: false,
			success: function(data) {
				tmpl_string = data;
			}
		});
		render.tmpl_cache[tmpl_name] = Handlebars.compile(tmpl_string);
	}
	return render.tmpl_cache[tmpl_name](tmpl_data);
}

if (!('contains' in String.prototype)) {
	String.prototype.contains = function(str, startIndex) {
		return ''.indexOf.call(this, str, startIndex) !== -1;
	};
}

function objKeyTest(s){
	s= s.split('.')
	var obj= window[s.shift()];
	while(obj && s.length) obj= obj[s.shift()];
	return obj;
}

function processTime(secs, mins, hrs, days) {
	var s = 0;
	if (!days) { days = 0; }
	if (!hrs) { hrs = 0; }
	if (!mins) { mins = 0; }
	if (!secs) { secs = 0; }
	s = (
		parseInt(days)*86400 +
		parseInt(hrs)*3600 +
		parseInt(mins)*60 +
		parseInt(secs));
	return s;
}

$.fn.serializeObject = function() {
	var obj = {};
	var arr = this.serializeArray();
	$.each(arr, function() {
		if (obj[this.name] !== undefined) {
			if (!obj[this.name].push) {
				obj[this.name] = [obj[this.name]];
			}
			obj[this.name].push(this.value || '');
		} else {
			obj[this.name] = this.value || '';
		}
	});
	return obj;
};

$.fn.disable = function() {
	$(this).addClass('disabled');
	$(this).prop('disabled', true);
}

$.fn.enable = function() {
	$(this).removeClass('disabled');
	$(this).prop('disabled', false);
}

Array.prototype.sum = function(selector) {
	if (typeof selector !== 'function') {
		selector = function(item) {
			return item;
		}
	}
	var sum = 0;
	for (var i = 0; i < this.length; i++) {
		sum += parseFloat(selector(this[i]));
	}
	return sum;
}

Array.prototype.highestIndexes = function() {
	var maxVal = -1;
	var maxIndex = [0];
	for (i = 0; i < this.length; i++) {
		if (this[i] > maxVal) {
			maxVal = this[i];
			maxIndex = [i];
		}
		else if (this[i] == maxVal) {
			maxIndex.push(i);
		}
	}
	return maxIndex;
}
