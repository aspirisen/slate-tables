import { Location } from 'slate'
import { TableEditor } from '#core'
import { TableCellNode } from '#nodes'
import { getSheet } from './getSheet'

export function canIncreaseRowspan(editor: TableEditor, location: Location | null = editor.selection) {
	const sheet = getSheet(editor, location)

	if (!sheet) {
		return false
	}

	const { cell } = sheet
	const cellBelow = sheet.getCellBelow()
	if (!cellBelow) return false

	if (TableCellNode.getCellColspan(cell.node) !== TableCellNode.getCellColspan(cellBelow.node)) {
		return false
	}

	return true
}
