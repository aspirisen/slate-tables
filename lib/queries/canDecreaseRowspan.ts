import { Location } from 'slate'
import { TableCellNode } from '#nodes'
import { TableEditor } from '#core'
import { getSheet } from './getSheet'

export function canDecreaseRowspan(editor: TableEditor, location: Location | null = editor.selection) {
	const sheet = getSheet(editor, location)

	return TableCellNode.getCellRowspan(sheet?.cell.node) > 1
}
