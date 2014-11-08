Parse.initialize("02iUkCJOt8dlrS6AxmNlgrLh5qy35eyWiRzD9dkm", "xC6fqYNjCZEpLh4ybBrWGhzJAyPmXvGsqJGqMlVg");

var user = window.localStorage["user"];

var TestObject = Parse.Object.extend("TestObject");
var testObject = new TestObject();
testObject.save({foo: "bar"}).then(function(object) {
  alert("yay! it worked");
});

console.log(user);

function loadLanguages() {

}

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'translate') {

  }
});