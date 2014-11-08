var select = document.querySelector('#language');

var options = '';
for(lname in languages) {
	options += '<option value="' + languages[lname] +'">' + lname + '</option>';
}

select.innerHTML = options;

var languageForm = document.querySelector('#languageForm');
languageForm.addEventListener('submit', function (ev) {
	ev.preventDefault();

	var selected;

	for(var i in select.childNodes) {
		var option = select.childNodes[i];

		if(option.value == select.value){
			selected = option;
			break;
		}
	}

	chrome.runtime.sendMessage({
		name: selected.innerText,
		code: select.value,
		action: 'addLanguage'
	}, function (response) {
		if (!response.success) {
			alert('failed to add language');
			return;
		}

		alert('successfully added language ' + selected.innerText)
	});

}, false);

var loginForm = document.querySelector('#loginForm');
loginForm.addEventListener('submit', function (ev) {
	ev.preventDefault();

	chrome.runtime.sendMessage({
		username: document.querySelector('#username').value,
		action: 'loginUser'
	}, function (response) {
		if (response.success) {
			toggleForms();
		}
	});
});

function toggleForms () {
	languageForm.style.display = 'block';
	loginForm.style.display = 'none';
}