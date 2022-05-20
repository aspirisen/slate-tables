import { Transforms, Range } from 'slate'
import { TableEditor } from '#core'
import { TableNode } from '#nodes'

export function insertTableAtRange(editor: TableEditor, range: Range) {
	const table = TableNode.createTableNode(editor)
	Transforms.insertNodes(editor, table, { at: range })
}
