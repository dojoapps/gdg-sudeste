var select = document.querySelector('#language');

var options = '';
for(lname in languages) {
	options += '<option value="' + languages[lname] +'">' + lname + '</option>';
}

select.innerHTML = options;

var form = document.querySelector('#language-form');

form.addEventListener('submit', function (ev) {
	ev.preventDefault();

	var selected;

	for(var i in select.childNodes) {
		var option = select.childNodes[i];

		if(option.value == select.value)
			selected = option;
	}

 	saveLanguage(selected.innerText, select.value);
}, false);

