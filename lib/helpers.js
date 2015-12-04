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