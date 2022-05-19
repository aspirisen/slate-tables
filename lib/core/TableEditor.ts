import { BaseEditor, Element } from 'slate'

export interface TableNodeType {
	table: string
	row: string
	cell: string
}

export interface TableSchema {
	tableNodeTypes: TableNodeType
	createContentNode: () => Element
}

export interface TableEditor extends TableSchema, BaseEditor {}
