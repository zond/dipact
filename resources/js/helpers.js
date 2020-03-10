
export function minutesToDuration(m) {
	let reduce = null
	reduce = m => {
		if (m < 60) {
			return '' + m + 'm';
		} else if (m < 60 * 24) {
			let h = m / 60;
			let remainder = m - (h * 60);
			let rval = '' + h + 'h';
			if (remainder == 0) {
				return rval;
			}
			return rval + ' ' + reduce(remainder);
		} else {
			let d = m / (60 * 24);
			let remainder = m - (d * 60 * 24);
			let rval = '' + d + 'd';
			if (remainder == 0) {
				return rval;
			}
			return rval + ' ' + reduce(remainder);
		}
	};
	return reduce(m);
}

