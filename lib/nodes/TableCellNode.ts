import { BaseElement, Element, Node, NodeEntry } from 'slate'
import { TableEditor } from '#core'

export interface TableCellNode extends BaseElement {
	type: string
	rowSpan?: number
	colSpan?: number
}

export namespace TableCellNode {
	export function isTableCellNode(editor: TableEditor, value: Node | undefined): value is TableCellNode {
		return Element.isElementType<TableCellNode>(value, editor.tableNodeTypes.cell)
	}

	export function isTableCellNodeEntry(
		editor: TableEditor,
		value: NodeEntry<Node> | undefined
	): value is NodeEntry<TableCellNode> {
		return isTableCellNode(editor, value?.[0])
	}

	export function createTableCellNode(editor: TableEditor) {
		return { type: editor.tableNodeTypes.cell, children: [editor.createContentNode()] }
	}

	export function getCellColspan(cell?: TableCellNode) {
		return cell?.colSpan ?? 1
	}

	export function getCellRowspan(cell?: TableCellNode) {
		return cell?.rowSpan ?? 1
	}
}
