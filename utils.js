
function getUser() {

	const user = JSON.parse(localStorage.getItem('userName'))
	if (!user){
		document.getElementById('usernameBtn').addEventListener('click', function(e){
		let usernameInput = document.getElementById('username-input')
		let element = document.getElementById('usernameBtn')
		let helloUser = document.getElementById('helloUser')

		usernameInput.classList.add('hidden')
		element.classList.add('hidden')
		helloUser.classList.remove('hidden')

		helloUser.innerHTML = `<div class ="helloUser">
				<span class="wave">👋</span> Hello ${usernameInput.value}</div>`
		
		localStorage.setItem('userName', JSON.stringify(usernameInput.value))
	})
	} else {
		return helloUser.innerHTML = `<div class ="helloUser">
				<span class="wave">👋</span> Hello ${user}</div>`
	}

	console.log(user)
}

const month_names = [
	'January', 'February', 'March', 'April', 'May', 'June', 
	'July', 'August', 'September', 'October', 'November', 'December'
]

function formattedDate(date, preformattedDate = false, hideYear = false) {
	const day = date.getDate();
	const month = month_names[date.getMonth()];
	const year = date.getYear();
	const hours = date.getHours();
	let minutes = date.getMinutes();

	if (minutes < 10) {
		minutes = `0${minutes}`;
	}
	if (preformattedDate) {
		return `${preformattedDate} at ${hours}:${minutes}`;
	}
	if (hideYear) {
		return `${day} ${month} at ${hours}:${ minutes }`;
	}
	return `${ day }. ${ month } ${ year }. at ${ hours }:${ minutes }`;
}

function timeAgo(dateParameter) {
	if (!dateParameter) {
		return null;
	}

	const date = typeof dateParameter === 'object' ? dateParameter : new Date(dateParameter);
	const day_in_ms = 86400000; // 24*60*60*1000
	const today = new Date();
	const yesterday = new Date(today - day_in_ms);
	const seconds = Math.round((today - date) / 1000);
	const minutes = Math.round(seconds / 60);
	const isToday = today.toDateString() === date.toDateString();
	const isYesterday = yesterday.toDateString() === date.toDateString();
	const isThisYear = today.getFullYear() === date.getFullYear();

	if (isToday) {
		return formattedDate(date, 'Today'); //Today at 11:30
	} else if (isYesterday) {
		return formattedDate(date, 'Yesterday');
	} else if (isThisYear) {
		return formattedDate(date, false, true);
	}

	return formattedDate(date);
}


export { timeAgo, getUser}