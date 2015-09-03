# webspeech
## Web Speech API wrapper for browser. Tested on Chrome 43+

### Installation

	$ npm install webspeech

### Usage
```javascript
var WebSpeech	= require("webspeech");

var listener = new WebSpeech.SpeechRecognizer({
  language: 'en'
});

listener.on('bestResult', function(text) {
  console.log("Recognized text: " + text);
});

listener.on('listen', function(event) {
  console.log("Listening...");
});

listener.on('error', function(event) {
  console.error(event);
});

listener.on('soundEnd', function(event) {
  console.log("Listen finished");
});

// Start listening...
listener.listen();

```

