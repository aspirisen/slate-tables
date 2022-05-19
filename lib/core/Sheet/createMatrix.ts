import { List, Record } from 'immutable'
import { NodeEntry } from 'slate'
import { TableNode, TableCellNode } from '#nodes'

export type Matrix = List<List<Record<{ virtual: boolean; ref: NodeEntry<TableCellNode> | null }>>>

export function createMatrix(tableNode: TableNode) {
	let matrix: Matrix = List()

	const rows = tableNode.children
	let rowIdx = 0

	for (const row of rows) {
		let colIdx = 0

		if (!matrix.get(rowIdx)) {
			matrix = matrix.set(rowIdx, List())
		}

		for (const cell of row.children) {
			let colSpanIdx

			for (let spanIdx = rowIdx; spanIdx < rowIdx + TableCellNode.getCellRowspan(cell); spanIdx++) {
				if (!matrix.get(spanIdx)) {
					matrix = matrix.set(spanIdx, List())
				}

				for (colSpanIdx = 0; colSpanIdx < TableCellNode.getCellColspan(cell); colSpanIdx++) {
					// Insert cell at first empty position
					let i = 0

					while (matrix.get(spanIdx)?.get(colIdx + colSpanIdx + i)) {
						i++
					}

					const fakeCell = colSpanIdx > 0 || spanIdx !== rowIdx
					matrix = matrix.setIn([spanIdx, colIdx + colSpanIdx + i], { ref: cell, virtual: fakeCell })
				}
			}

			colIdx += colSpanIdx ?? 1
		}

		rowIdx += 1
	}

	return matrix
}
