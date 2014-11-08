Parse.initialize("02iUkCJOt8dlrS6AxmNlgrLh5qy35eyWiRzD9dkm", "xC6fqYNjCZEpLh4ybBrWGhzJAyPmXvGsqJGqMlVg");

var googleKey = 'AIzaSyAkmpI7nWTOn46YsxWV-msPYrxpPR-VhkU';
var user = window.localStorage["user"];
var languageActions = {};
var loadedLanguges = [];
var noop = function() {};

var ParseLanguage = Parse.Object.extend("ParseLanguage");
var ParseTranslation = Parse.Object.extend("ParseTranslation");

function loadLanguages(next) {
  if (!user) {
    return;
  }

  var query = new Parse.Query("ParseLanguage");
  query.equalTo("user", user);
  query.ascending("name");
  query.find({
    success: function (results) {
      chrome.contextMenus.removeAll(function () {
        loadedLanguges = [];
        for (var i = 0, l = results.length; i < l; i++) {
          addLanguageToContext(results[i]);
          loadedLanguges.push(results[i].attributes);
        }
        next(loadLanguages);
      });
      
    },
    error: function (error) {
      console.log(error);
      next({ success: false, error: error});
    }
  });
}

function addLanguageToContext(language) {
  var code = language.get('code');
  if (!languageActions[code]) {
    languageActions[code] = chrome.contextMenus.create({
      title: "Traduzir para " + language.get('name'),
      contexts: ["selection"],
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
      message: 'Traduzindo: ' + info.selectionText
    }, cb);
    googleTranslate(languageCode, info.selectionText, function (err, result) {
      if (err) {
        return translationError(err, id, info.selectionText);
      }

      var translation = new ParseTranslation();
      translation.save({
        user: user,
        sourceText: info.selectionText,
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
                message: 'Texto traduzido: ' + result.get('translation')
              }, cb);
            },
            error: function (err) {
              translationError(err, id, info.selectionText);
            }
          });
        },
        error: function(err) {
          translationError(err, id, info.selectionText);
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

function addLanguage(name, code, next) {
  var language = new ParseLanguage();
  language.set('name', name);
  language.set('code', code);
  language.set('user', user);
  language.save(null, {
    success: function (result) {
      addLanguageToContext(result);
      next({ success: true });
    }
  });
}

function removeLanguage(code, next) {
  var langContext = languageActions[code];
  if (langContext) {
    chrome.contextMenus.remove(langContext, function() {
      delete languageActions[code];
      next({ success : true });
      var query = new Parse.Query(ParseLanguage);
      query.equalTo('user', user);
      query.equalTo('code', code);
      query.find({
        success: function (result) {
          results[0].destroy();
        },
        error: function (error) {

        }
      });
    });
  }
}

function loginUser(username, next) {
  username = username.replace(/[^\w]/ig, '');
  window.localStorage["user"] = username;
  user = username;
  loadLanguages();

  next({ success: true });
}

loadLanguages(noop);

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  switch (message.action) {
    case 'getUser':
      sendResponse(user);
      break;
    case 'loginUser':
      loginUser(message.username, sendResponse);
      break;
    case 'addLanguage':
      addLanguage(message.name, message.code, sendResponse);
      break;
    case 'removeLanguage':
      removeLanguage(message.code, sendResponse);
      break;
    case 'loadLanguages':
      loadLanguages(sendResponse);
      break;
    default:
      throw new Error('Ação inválida.');
  }
});