import { BaseElement, Element, Node, NodeEntry } from 'slate'
import { TableEditor } from '#core'
import { TableCellNode } from './TableCellNode'

export interface TableRowNode extends BaseElement {
	type: string
	children: TableCellNode[]
}

export namespace TableRowNode {
	export function isTableRowNode(editor: TableEditor, value: Node | undefined): value is TableRowNode {
		return Element.isElementType<TableRowNode>(value, editor.tableNodeTypes.row)
	}

	export function isTableRowNodeEntry(
		editor: TableEditor,
		value: NodeEntry<Node> | undefined
	): value is NodeEntry<TableRowNode> {
		return isTableRowNode(editor, value?.[0])
	}

	export function createTableRowNode(editor: TableEditor, cellsCount = 1) {
		return {
			type: editor.tableNodeTypes.row,
			children: Array.from(Array(cellsCount)).map(() => TableCellNode.createTableCellNode(editor))
		}
	}
}
