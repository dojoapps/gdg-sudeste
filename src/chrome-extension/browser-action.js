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
      chrome.contextMenus.removeAll(function () {
        for (var i = 0, l = results.length; i < l; i++) {
          addLanguageToContext(results[i]);
        }  
      });
      
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

function cb() {
  console.log(arguments);
}

function handleTranslateTo(languageCode) {
  return function (info, tab) {
    var id = 't_' + new Date().valueOf();
    chrome.notifications.create(id, {
      type: "basic",
      iconUrl: "icon/icon128.png",
      title: 'Wear Translator',
      message: 'Traduzindo :' + info.selectedText
    }, cb);
    googleTranslate(languageCode, info.selectedText, function (err, result) {
      if (err) {
        return translationError(err, id, info.selectedText);
      }

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
            success: function () {
              chrome.notifications.update(id, {
                title: 'Tradução concluída',
                message: info.selectedText + ' foi traduzido para ' + result.get('translation')
              }, cb);
            },
            error: function (err) {
              translationError(err, id, info.selectedText);
            }
          });
        },
        error: function(err) {
          translationError(err, id, info.selectedText);
        }
      });
    });
  };
}

function translationError(error, id, message) {
  console.error(error);
  chrome.notifications.update(id, {
    title: 'Erro de tradução',
    message: 'Não foi possível traduzir: ' + message
  }, cb);
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