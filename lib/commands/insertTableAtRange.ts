import { BaseRange, Editor, Transforms } from 'slate'
import { createTableNode } from '../utils'

export default function insertTableAtRange({ blocks }: any, editor: Editor, range: BaseRange) {
	const table = createTableNode({ blocks })
	Transforms.insertNodes(editor, table, { at: range })
}
