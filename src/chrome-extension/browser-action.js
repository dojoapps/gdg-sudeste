Parse.initialize("02iUkCJOt8dlrS6AxmNlgrLh5qy35eyWiRzD9dkm", "xC6fqYNjCZEpLh4ybBrWGhzJAyPmXvGsqJGqMlVg");

var googleKey = 'AIzaSyAkmpI7nWTOn46YsxWV-msPYrxpPR-VhkU';
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
    googleTranslate(languageCode, info.selectedText, function (err, result) {
      var translation = new ParseTranslation();
      translation.set('user',user);
      translation.save({
        user: user,
        translation: result.translatedText,
        targetLanguage: languageCode,
        sourceLanguage: result.detectedSourceLanguage
      }, {
        success: function(result) {
          Parse.Push.send({
            channels: [user],
            data: result
          }, {
            success: function (result) {
              console.log('Notificação enviada.');
            },
            error: function (err) {
              console.error(err);
            }
          });
        },
        error: function(err) {
          console.log(err);
        }
      });
    });
  };
}

function googleTranslate(languageCode, text, next) {
  var req = new XMLHttpRequest();
  req.onload = function () {
    if (this.status === 200) {
      var resp = JSON.parse(this.responseText);
      if (resp.data && resp.data.translations) {
        next(null, resp.data.translations[0]);
      }      
    } else {
      next(new Error('Não foi possível achar uma tradução.'));
    }
  };
  req.onerror = function () {
    next(new Error('Não foi possível achar uma tradução.'));
  };

  var url = "https://www.googleapis.com/language/translate/v2?key=" + googleKey + "&target=" + languageCode + "&q=" + text;
  req.open("get",url, true);
  req.send();
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
  loadLanguages();
}

loadLanguages();