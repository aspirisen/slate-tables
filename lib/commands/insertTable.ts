import { TableEditor } from '#core'
import { insertTableAtRange } from './insertTableAtRange'

export default function insertTable(editor: TableEditor) {
	if (!editor.selection) {
		return undefined
	}

	return insertTableAtRange(editor, editor.selection)
}
