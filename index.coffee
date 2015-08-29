###

	WebSpeech API: https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html
###

_	= require "lodash"
ee 	= require "event-emitter"

###
	Speech Synthesis (TTS) wrapper class
###		
class TTS
	constructor: ->
		try
			@ss = new SpeechSynthesisUtterance
		catch ex
			throw new Error('This browser does not have support for webspeech api')
		@ss.rate = 1.0

		@ss.onend = (event) ->
			console.log "Speech finished."
			return

	speak: (lang, text) ->
		@ss.lang = lang
		@ss.text = text
		speechSynthesis.speak @ss
		return

	cancel: -> speechSynthesis.cancel()
	pause: -> speechSynthesis.pause()
	resume: -> speechSynthesis.resume()

###
	Speech Recognizer wrapper class
###		
class SpeechRecognizer
	constructor: (options) ->

		@options = _.defaults (options || {}),
			language: 'en'
			maxAlternatives: 1

		@emitter = ee({})

		try
			SR = window.SpeechRecognition ||
					window.webkitSpeechRecognition ||
					window.mozSpeechRecognition ||
					window.msSpeechRecognition ||
					window.oSpeechRecognition

			@listener = new SR()

			# Set the max number of alternative transcripts to try and match with a command
			@listener.maxAlternatives = @options.maxAlternatives;			

			@listener.lang = @options.language

		catch ex
			throw new Error('This browser does not have support for webspeech api')


		@listener.onresult = (event) =>
			@emitter.emit("result", event)
			
			if event.results.length > 0
				result = event.results[event.results.length - 1]
				if result.isFinal
					@emitter.emit "bestResult", result[0].transcript
			return

		@listener.onerror = (event) =>
			@emitter.emit("error", event)
			return

		@listener.onnomatch = (event) =>
			@emitter.emit("nomatch", event)
			return

		@listener.onsoundstart = (event) =>
			@emitter.emit("soundStart", event)
			return

		@listener.onspeechstart = (event) =>
			@emitter.emit("speechStart", event)
			return

		@listener.onspeechstop = (event) =>
			@emitter.emit("speechStop", event)
			return

		@listener.onsoundend = (event) =>
			@emitter.emit("soundEnd", event)
			return

	on: @emitter.on
	off: @emitter.off
	once: @emitter.once

	listen: -> 
		@listener.start()
		@emitter.emit("listen")
		return

	stop: ->
		@listener.stop()
		@emitter.emit("stop")
		return


module.exports =
	TTS: TTS
	SpeechRecognizer: SpeechRecognizer
