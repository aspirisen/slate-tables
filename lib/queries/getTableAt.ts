import { BaseRange, Editor } from 'slate'
import { SlateTableOptions } from 'types'
import { Table } from '../utils'

export function getTableAt(options: SlateTableOptions, editor: Editor, range: BaseRange) {
	return Table.create(options, editor, range)
}
