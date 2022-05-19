import { BaseElement, Element, Node, NodeEntry } from 'slate'

export interface Blocks {
	table: string
	row: string
	cell: string
	content: string
}

export interface SlateTableOptions {
	blocks: Blocks
}

export interface TableNode extends BaseElement {
	type: string
	children: TableRowNode[]
}

export interface TableRowNode extends BaseElement {
	type: string
	children: TableCellNode[]
}

export interface TableCellNode extends BaseElement {
	type: string
	rowSpan?: number
	colSpan?: number
}

export function isTableNode(value: unknown, blocks: Blocks): value is TableNode {
	return Element.isElementType<TableNode>(value, blocks.table)
}

export function isTableNodeEntry(value: NodeEntry<Node> | undefined, blocks: Blocks): value is NodeEntry<TableNode> {
	return isTableNode(value?.[0], blocks)
}

export function isTableRowNode(value: unknown, blocks: Blocks): value is TableRowNode {
	return Element.isElementType<TableRowNode>(value, blocks.row)
}

export function isTableRowNodeEntry(
	value: NodeEntry<Node> | undefined,
	blocks: Blocks
): value is NodeEntry<TableRowNode> {
	return isTableRowNode(value?.[0], blocks)
}

export function isTableCellNode(value: unknown, blocks: Blocks): value is TableCellNode {
	return Element.isElementType<TableCellNode>(value, blocks.cell)
}

export function isTableCellNodeEntry(
	value: NodeEntry<Node> | undefined,
	blocks: Blocks
): value is NodeEntry<TableCellNode> {
	return isTableCellNode(value?.[0], blocks)
}
