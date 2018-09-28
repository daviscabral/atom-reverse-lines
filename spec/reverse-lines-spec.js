describe('reversing lines', () => {
  let activationPromise, editor, editorView

  const runCommand = (commandName, callback) => {
    atom.commands.dispatch(editorView, commandName)
    waitsForPromise(() => activationPromise)
    runs(callback)
  }

  const reverseLines =
    (callback) => runCommand('reverse-lines', callback)

  beforeEach(() => {
    waitsForPromise(() => atom.workspace.open())

    runs(() => {
      editor = atom.workspace.getActiveTextEditor()
      editorView = atom.views.getView(editor)
      activationPromise = atom.packages.activatePackage('reverse-lines')
    })
  })

  describe('when no lines are selected', () => {
    it('reverses all lines', () => {
      editor.setText(
        'Hydrogen \n' +
        'Helium   \n' +
        'Lithium    '
      )
      editor.setCursorBufferPosition([0, 0])

      reverseLines(() =>
        expect(editor.getText()).toBe(
          'Lithium    \n' +
          'Helium   \n' +
          'Hydrogen '
        )
      )
    })

    it('reverses all lines, ignoring the trailing new line', () => {
      editor.setText(
        'Hydrogen \n' +
        'Helium   \n' +
        'Lithium  \n'
      )
      editor.setCursorBufferPosition([0, 0])

      reverseLines(() =>
        expect(editor.getText()).toBe(
          'Lithium  \n' +
          'Helium   \n' +
          'Hydrogen \n'
        )
      )
    })

    it('gracefully handles attempt to reverse an empty editor', () => {
      editor.setText('')
      editor.setCursorBufferPosition([0, 0])

      reverseLines(() => expect(editor.getText()).toBe(''))
    })
  })

  describe('when entire lines are selected', () =>
    it('reverses the selected lines', () => {
      editor.setText(
        'Hydrogen  \n' +
        'Helium    \n' +
        'Lithium   \n' +
        'Beryllium \n' +
        'Boron     \n'
      )
      editor.setSelectedBufferRange([[1, 0], [4, 0]])

      reverseLines(() =>
        expect(editor.getText()).toBe(
          'Hydrogen  \n' +
          'Beryllium \n' +
          'Lithium   \n' +
          'Helium    \n' +
          'Boron     \n'
        )
      )
    })
  )

  describe('when partial lines are selected', () =>
    it('reverses the selected lines', () => {
      editor.setText(
        'Hydrogen  \n' +
        'Helium    \n' +
        'Lithium   \n' +
        'Beryllium \n' +
        'Boron     \n'
      )
      editor.setSelectedBufferRange([[1, 3], [3, 2]])

      reverseLines(() =>
        expect(editor.getText()).toBe(
          'Hydrogen  \n' +
          'Beryllium \n' +
          'Lithium   \n' +
          'Helium    \n' +
          'Boron     \n'
        )
      )
    })
  )

  describe('when there are multiple selection ranges', () =>
    it('reverses the lines in each selection range', () => {
      editor.setText(
        'Hydrogen                \n' +
        'Helium    # selection 1 \n' +
        'Beryllium # selection 1 \n' +
        'Carbon                  \n' +
        'Fluorine  # selection 2 \n' +
        'Aluminum  # selection 2 \n' +
        'Gallium                 \n' +
        'Europium                \n'
      )
      editor.addSelectionForBufferRange([[1, 0], [3, 0]])
      editor.addSelectionForBufferRange([[4, 0], [6, 0]])

      reverseLines(() =>
        expect(editor.getText()).toBe(
          'Hydrogen                \n' +
          'Beryllium # selection 1 \n' +
          'Helium    # selection 1 \n' +
          'Carbon                  \n' +
          'Aluminum  # selection 2 \n' +
          'Fluorine  # selection 2 \n' +
          'Gallium                 \n' +
          'Europium                \n'
        )
      )
    })
  )
})
