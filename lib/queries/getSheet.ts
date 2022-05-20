import { Location } from 'slate'
import { Sheet, TableEditor } from '#core'

export function getSheet(editor: TableEditor, location: Location | null = editor.selection) {
	if (!location) {
		return null
	}

	return Sheet.create(editor, location)
}
