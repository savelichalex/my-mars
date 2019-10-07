const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const formatDate = (date: Date): string =>
	`${months[date.getMonth()]} ${date.getDay()}, ${date.getFullYear()}`;
