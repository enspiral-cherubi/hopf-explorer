var $ = require('jquery')

var buttons = {
  $modeButton: $('#mode-button'),
  init: function (env){
    this.env = env
    this.bindEventListeners()
  },

  bindEventListeners: function() {
    var self = this
    this.$modeButton.click(function (e){
      e.preventDefault()
      self.env.toggleMode()
    })
  }
}

module.exports = buttons
