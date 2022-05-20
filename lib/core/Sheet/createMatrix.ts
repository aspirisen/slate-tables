import { List, Record } from 'immutable'
import { Node } from 'slate'
import { NodePath } from '#utils/types'
import { TableEditor } from '#core'
import { TableNode, TableCellNode } from '#nodes'

export type Matrix = List<List<Record<{ virtual: boolean; ref: NodePath<TableCellNode> | null }>>>

export function createMatrix(editor: TableEditor, table: NodePath<TableNode>) {
	let matrix: Matrix = List()

	const rows = Node.children(table.node, table.path)
	let rowIdx = 0

	for (const [row, rowPath] of rows) {
		const cells = Node.children(row, rowPath)
		let colIdx = 0

		if (!matrix.get(rowIdx)) {
			matrix = matrix.set(rowIdx, List())
		}

		for (const [cell, cellPath] of cells) {
			let colSpanIdx = 0

			if (!TableCellNode.isTableCellNode(editor, cell)) {
				continue
			}

			for (let spanIdx = rowIdx; spanIdx < rowIdx + TableCellNode.getCellRowspan(cell); spanIdx++) {
				if (!matrix.get(spanIdx)) {
					matrix = matrix.set(spanIdx, List())
				}

				for (; colSpanIdx < TableCellNode.getCellColspan(cell); colSpanIdx++) {
					// Insert cell at first empty position
					let i = 0

					while (matrix.get(spanIdx)?.get(colIdx + colSpanIdx + i)) {
						i++
					}

					const fakeCell = colSpanIdx > 0 || spanIdx !== rowIdx

					matrix = matrix.setIn([spanIdx, colIdx + colSpanIdx + i], {
						ref: { node: cell, path: cellPath },
						virtual: fakeCell
					})
				}
			}

			colIdx += colSpanIdx
		}

		rowIdx += 1
	}

	return matrix
}
