import { Location } from 'slate'
import { TableCellNode } from '#nodes'
import { TableEditor } from '#core'
import { getSheet } from './getSheet'

export function canDecreaseColspan(editor: TableEditor, location: Location | null = editor.selection) {
	const sheet = getSheet(editor, location)

	return TableCellNode.getCellColspan(sheet?.cell.node) > 1
}
