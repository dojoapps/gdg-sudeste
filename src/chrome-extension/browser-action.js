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
        var language = results[i];
        if (!languageActions[language.code]) {
          languageActions[language.code] = chrome.contextMenus.create({
            title: "Traduzir para " + language.name,
            contexts: ["all"],
            onclick: handleTranslateTo(language.code)
          });
        }
      };
    },
    error: function (error) {
      console.log(error);
    }
  });
}

function handleTranslateTo(languageCode) {
  return function (info, tab) {
    //TODO: Salvar a ParseTranslation e enviar o Push
    
  };
}

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'translate') {

  }
});