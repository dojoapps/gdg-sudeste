var user;
var activeLanguages = document.querySelector('#activeLanguages');

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
      activeLanguages.innerHTML = '';
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
    loadLanguages();
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
      loadLanguages();
		}
	});
});

function loadLanguages () {
  activeLanguages.innerHTML = '';
  chrome.runtime.sendMessage({ action: 'loadLanguages' }, function (response) {
    var languages = response.languages;
    var output = '<h3>Minhas linguas:</h3><ul>';
    for (var i=0;i<languages.length;i++) {
      var l = languages[i];
      output += '<li>' + l.name + ' (<a class="remover" data-code="' + l.code + '">remover</a>)</li>';
    }
    output += '</ul>';

    activeLanguages.innerHTML = output;
  });
}

function toggleForms () {
	languageForm.style.display = 'block';
	loginForm.style.display = 'none';
}

activeLanguages.addEventListener('click', function (ev) {
  if (ev.target.className === 'remover') {
    var code = ev.target.attributes["data-code"].value;
    chrome.runtime.sendMessage({ action: 'removeLanguage', code: code }, 
      function(response) {
        if (response.success) {
          loadLanguages();
        }
      });
  }
});
