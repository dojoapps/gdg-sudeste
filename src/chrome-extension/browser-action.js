Parse.initialize("02iUkCJOt8dlrS6AxmNlgrLh5qy35eyWiRzD9dkm", "xC6fqYNjCZEpLh4ybBrWGhzJAyPmXvGsqJGqMlVg");

var user = window.localStorage["user"];
var languageActions = {};

var ParseLanguage = Parse.Object.extend("ParseLanguage");
var ParseTranslation = Parse.Object.extend("ParseTranslation");

function loadLanguages() {
  if (!user) {
    return;
  }

  var query = new Parse.Query("ParseLanguage");
  query.equalTo("user", user);
  query.ascending("name");
  query.find({
    success: function (results) {
      for (var i = 0, l = results.length; i < 0; i++) {
        addLanguageToContext(results[i]);
      };
    },
    error: function (error) {
      console.log(error);
    }
  });
}

function addLanguageToContext(language) {
  var code = language.get('code');
  if (!languageActions[code]) {
    languageActions[code] = chrome.contextMenus.create({
      title: "Traduzir para " + language.get('name'),
      contexts: ["all"],
      onclick: handleTranslateTo(code)
    });
  }
}

function handleTranslateTo(languageCode) {
  return function (info, tab) {
    //TODO: Salvar a ParseTranslation e enviar o Push

  };
}

function saveLanguage(name, code) {
  var language = new ParseLanguage();
  language.set('name', name);
  language.set('code', code);
  language.set('user', user);
  language.save(null, {
    success: function (result) {
      addLanguageToContext(result);
    }
  });
}

function loginUser(email) {
  window.localStorage["user"] = email;
  user = email;
}