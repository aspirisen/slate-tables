import { Location, Node } from 'slate'
import { TableEditor } from '#core'
import { getSheet } from './getSheet'

export default function isInTable(editor: TableEditor, location: Location | null = editor.selection) {
	if (!location) {
		return false
	}

	try {
		const sheet = getSheet(editor, location)
		return Node.isNode(sheet?.table.node)
	} catch {
		return false
	}
}
