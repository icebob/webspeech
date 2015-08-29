// Generated by CoffeeScript 1.9.3

/*

	WebSpeech API: https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html
 */
var SpeechRecognizer, TTS, _, ee,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

_ = require("lodash");

ee = require("event-emitter");


/*
	Speech Synthesis (TTS) wrapper class
 */

TTS = (function() {
  function TTS(options) {
    var ex;
    this.options = _.defaults(options || {}, {
      language: 'en',
      rate: 1.0,
      volume: 1.0,
      pitch: 1.0
    });
    try {
      this.ss = new SpeechSynthesisUtterance;
    } catch (_error) {
      ex = _error;
      throw new Error('This browser does not have support for webspeech api');
    }
    this.ss.onend = function(event) {
      console.log("Speech finished.");
    };
  }

  TTS.prototype.speak = function(obj) {
    if (typeof obj === 'string') {
      this.ss.text = obj;
    } else {
      this.ss.lang = obj.language || this.options.language;
      this.ss.rate = obj.rate || this.options.rate;
      this.ss.volume = obj.volume || this.options.volume;
      this.ss.pitch = obj.pitch || this.options.pitch;
      this.ss.text = obj.text;
    }
    speechSynthesis.speak(this.ss);
  };

  TTS.prototype.cancel = function() {
    return speechSynthesis.cancel();
  };

  TTS.prototype.pause = function() {
    return speechSynthesis.pause();
  };

  TTS.prototype.resume = function() {
    return speechSynthesis.resume();
  };

  return TTS;

})();


/*
	Speech Recognizer wrapper class
 */

SpeechRecognizer = (function() {
  function SpeechRecognizer(options) {
    this.once = bind(this.once, this);
    this.off = bind(this.off, this);
    this.on = bind(this.on, this);
    var SR, ex;
    this.options = _.defaults(options || {}, {
      language: 'en',
      maxAlternatives: 1
    });
    this.emitter = ee({});
    try {
      SR = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition || window.oSpeechRecognition;
      this.listener = new SR();
      this.listener.maxAlternatives = this.options.maxAlternatives;
      this.listener.lang = this.options.language;
    } catch (_error) {
      ex = _error;
      throw new Error('This browser does not have support for webspeech api');
    }
    this.listener.onresult = (function(_this) {
      return function(event) {
        var result;
        _this.emitter.emit("result", event);
        if (event.results.length > 0) {
          result = event.results[event.results.length - 1];
          if (result.isFinal) {
            _this.emitter.emit("bestResult", result[0].transcript);
          }
        }
      };
    })(this);
    this.listener.onerror = (function(_this) {
      return function(event) {
        _this.emitter.emit("error", event);
      };
    })(this);
    this.listener.onnomatch = (function(_this) {
      return function(event) {
        _this.emitter.emit("nomatch", event);
      };
    })(this);
    this.listener.onsoundstart = (function(_this) {
      return function(event) {
        _this.emitter.emit("soundStart", event);
      };
    })(this);
    this.listener.onspeechstart = (function(_this) {
      return function(event) {
        _this.emitter.emit("speechStart", event);
      };
    })(this);
    this.listener.onspeechstop = (function(_this) {
      return function(event) {
        _this.emitter.emit("speechStop", event);
      };
    })(this);
    this.listener.onsoundend = (function(_this) {
      return function(event) {
        _this.emitter.emit("soundEnd", event);
      };
    })(this);
  }

  SpeechRecognizer.prototype.on = function(event, cb) {
    return this.emitter.on(event, cb);
  };

  SpeechRecognizer.prototype.off = function(event, cb) {
    return this.emitter.off(event, cb);
  };

  SpeechRecognizer.prototype.once = function(event, cb) {
    return this.emitter.once(event, cb);
  };

  SpeechRecognizer.prototype.listen = function() {
    this.listener.start();
    this.emitter.emit("listen");
  };

  SpeechRecognizer.prototype.stop = function() {
    this.listener.stop();
    this.emitter.emit("stop");
  };

  return SpeechRecognizer;

})();

module.exports = {
  TTS: TTS,
  SpeechRecognizer: SpeechRecognizer
};
