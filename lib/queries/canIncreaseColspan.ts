import { Location, Node } from 'slate'
import { TableEditor } from '#core'
import { TableCellNode } from '#nodes'
import { getSheet } from './getSheet'

export function canIncreaseColspan(editor: TableEditor, location: Location | null = editor.selection) {
	const sheet = getSheet(editor, location)

	if (!sheet) {
		return false
	}

	const { row, cell, nextCell } = sheet
	const [lastNode] = Node.last(row.node, row.path)

	if (lastNode === cell.node) {
		return false
	}

	if (TableCellNode.getCellRowspan(cell.node) !== TableCellNode.getCellRowspan(nextCell?.node)) {
		return false
	}

	return true
}
