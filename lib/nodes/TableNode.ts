import { BaseElement, Element, Node, NodeEntry } from 'slate'
import { TableEditor } from '#core'
import { TableRowNode } from './TableRowNode'

export interface TableNode extends BaseElement {
	type: string
	children: TableRowNode[]
}

export namespace TableNode {
	export function isTableNode(editor: TableEditor, value: Node | undefined): value is TableNode {
		return Element.isElementType<TableNode>(value, editor.tableNodeTypes.table)
	}

	export function isTableNodeEntry(
		editor: TableEditor,
		value: NodeEntry<Node> | undefined
	): value is NodeEntry<TableNode> {
		return isTableNode(editor, value?.[0])
	}

	export function createTableNode(editor: TableEditor, rowsCount = 2, columnsCount = 2) {
		const rows = Array.from(Array(rowsCount)).map(() => TableRowNode.createTableRowNode(editor, columnsCount))
		return { type: editor.tableNodeTypes.table, children: rows }
	}
}
