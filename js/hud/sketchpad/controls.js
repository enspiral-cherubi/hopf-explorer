var $ = require('jquery')

var controls = {
  $sketchpad: $('#sketchpad'),
  $sketchModeSelector: $('#sketch-mode-selector'),
  $controlsModeSelector: $('#controls-mode-selector'),
  $toggleDisplayBtn: $('#toggle-sketchpad-display-btn'),

  init: function (env) {
    this.env = env
    this.bindEventListeners()
  },

  bindEventListeners: function() {
    var self = this

    this.$sketchModeSelector.change(function (e){
      self.env.sketchMode = $(this).val()
    })

    this.$controlsModeSelector.change(function (e) {
      self.env.setControlsMode($(this).val())
    })

    console.log('this.$toggleDisplayBtn: ', this.$toggleDisplayBtn)

    this.$toggleDisplayBtn.click(function (e) {
      e.preventDefault()
      var $this = $(this)
      self.$sketchpad.toggle()
      self.$sketchpad.is(':visible') ? $this.html('close') : $this.text('open')
    })
  }
}

module.exports = controls
