var user;

chrome.runtime.sendMessage({
	action: 'getUser'
}, function (u) {
	if (u) {
		user = u;
    loadLanguages();
		toggleForms();
	}
});

document.querySelector('#sair').onclick = function () {
	chrome.runtime.sendMessage({
		action: 'logoutUser'
	}, function (response) {
		if (response.success) {
			languageForm.style.display = 'none';
			loginForm.style.display = 'block';
      document.querySelector('#activeLanguages').innerHTML = '';
		}
	});

	return false;
};

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
      setTimeout(function() {
        loadLanguages();
      }, 50);
		}
	});
});

function loadLanguages () {
  languages = [{ code: 'pt-br', name: 'Portugues' }];
  var output = '<h3>Minhas línguas:</h3><ul>';
  for (var i=0;i<languages.length;i++) {
    var l = languages[i];
    output += '<li onclick="removeLanguage" data-code="' + l.code + '">' + l.name + '</li>';
  }
  output += '</ul>';

  document.querySelector('#activeLanguages').innerHTML = output;
}

function toggleForms () {
	languageForm.style.display = 'block';
	loginForm.style.display = 'none';
}

function removeLanguage(ev) {
  console.log(ev);
}

