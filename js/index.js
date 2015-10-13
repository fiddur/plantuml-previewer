$(function() {
  var $mode = $("#mode")

  var ls = window.localStorage

  var editor = ace.edit("editor")
  editor.setTheme("ace/theme/monokai")
  editor.getSession().setMode("ace/mode/diagram")

  var $form = $("#previewForm")
  $(function() {$('#editor').focus()})

  $form.submit(function() {
    var uml     = editor.getValue()
    var encoded = compress(uml)

    // Save the UML to location hash.
    location.hash = encoded

    // Update the preveiw.
    $("#canvas").attr("src", "http://www.plantuml.com/plantuml/svg/"+encoded)

    return false
  })

  // Set default UML example if none given.
  if (!location.hash) {location.hash = 'SyfFqhLppCbCJbMmKaZBp-Tooa-oqTL55W40'}

  // Load UML from location hash.
  editor.setValue(decode64(location.hash.substr(1)))

  // Trigger redraw on preview.
  $form.submit()

  // ACE mode 'vim' or 'emacs'.
  $mode.change(function() {
    var mode = $(this).val()

    addSubmitKey()

    ls && ls.setItem("mode", mode)
    editor.setKeyboardHandler(mode)
  })

  var mode = ls && ls.getItem("mode")
  if (mode) {
    $mode.val(mode)
    $mode.change()
  }

  function addSubmitKey() {
    editor.commands.addCommand({
      name: 'submit',
      bindKey: {win: 'Shift-Enter',  mac: 'Shift-Enter'},
      exec: function(editor) {
        $form.submit()
      },
      readOnly: false
    })
  }

  addSubmitKey()
})
