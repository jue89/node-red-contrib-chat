function pad (num) {
	return num.toString().padStart(2, '0');
}

export function convertDate (date) {
	date = new Date(date);
	return pad(date.getHours()) + ":" + pad(date.getMinutes());
}
