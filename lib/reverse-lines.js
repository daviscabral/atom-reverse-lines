const RangeFinder = require('./range-finder')

module.exports = {
  activate () {
    atom.commands.add('atom-text-editor:not([mini])', {
      'reverse-lines' () {
        reverseLines(atom.workspace.getActiveTextEditor())
      }
    })
  }
}

function reverseLines (editor) {
  const reversableRanges = RangeFinder.rangesFor(editor)
  reversableRanges.forEach((range) => {
    const textLines = editor.getTextInBufferRange(range).split(/\r?\n/g)
    const reversedTextLines = textLines.reverse()
    editor.setTextInBufferRange(range, reversedTextLines.join('\n'))
  })
}
