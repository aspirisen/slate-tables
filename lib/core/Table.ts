import { BaseRange, Editor, Node, NodeEntry, Path } from 'slate'
import { List, Record } from 'immutable'
import findLast from 'lodash.findlast'
import {
	SlateTableOptions,
	TableCellNode,
	TableNode,
	TableRowNode,
	isTableNode,
	isTableRowNode,
	isTableCellNode,
	Blocks,
	isTableNodeEntry,
	isTableRowNodeEntry,
	isTableCellNodeEntry
} from 'types'

const Cell = Record<{ virtual: boolean; ref: TableCellNode | null }>({ virtual: false, ref: null })
const Coordinates = Record<{ x: number | null; y: number | null }>({
	x: null,
	y: null
})

export const getCellColspan = (cell?: TableCellNode) => cell?.colSpan ?? 1
export const getCellRowspan = (cell?: TableCellNode) => cell?.rowSpan ?? 1

export class Table {
	static create(options: SlateTableOptions, editor: Editor, range: BaseRange) {
		const node = Editor.node(editor, Editor.path(editor, range))
		const ancestors = Array.from(Node.ancestors(editor, Editor.path(editor, range)))
		const allPossibleNodes = [node].concat(ancestors)
		const tableNode = findLast(allPossibleNodes, (n) => isTableNode(n, options.blocks))
		const rowNode = findLast(ancestors, (n) => isTableRowNode(n, options.blocks))
		const cellNode = findLast(ancestors, (n) => isTableCellNode(n, options.blocks))

		if (
			isTableNodeEntry(tableNode, options.blocks) &&
			isTableRowNodeEntry(rowNode, options.blocks) &&
			isTableRowNodeEntry(cellNode, options.blocks)
		) {
			const matrix = Table.createMatrix(tableNode[0])

			return new Table(options, editor, tableNode, rowNode, cellNode, matrix)
		}

		return null
	}

	private static createMatrix(tableNode: TableNode) {
		let matrix = List<List<Record<{ virtual: boolean; ref: NodeEntry<TableCellNode> | null }>>>()

		const rows = tableNode.children
		let rowIdx = 0

		for (const row of rows) {
			let colIdx = 0

			if (!matrix.get(rowIdx)) {
				matrix = matrix.set(rowIdx, List())
			}

			for (const cell of row.children) {
				let colSpanIdx

				for (let spanIdx = rowIdx; spanIdx < rowIdx + getCellRowspan(cell); spanIdx++) {
					if (!matrix.get(spanIdx)) {
						matrix = matrix.set(spanIdx, List())
					}

					for (colSpanIdx = 0; colSpanIdx < getCellColspan(cell); colSpanIdx++) {
						// Insert cell at first empty position
						let i = 0

						while (matrix.get(spanIdx)?.get(colIdx + colSpanIdx + i)) {
							i++
						}

						const fakeCell = colSpanIdx > 0 || spanIdx !== rowIdx
						matrix = matrix.setIn([spanIdx, colIdx + colSpanIdx + i], new Cell({ ref: cell, virtual: fakeCell }))
					}
				}

				colIdx += colSpanIdx ?? 1
			}

			rowIdx += 1
		}

		return matrix
	}

	private _prevCell: NodeEntry<TableCellNode> | undefined | null
	private _nextCell: NodeEntry<TableCellNode> | undefined | null
	private _cellAbove: NodeEntry<TableCellNode> | undefined | null
	private _cellBelow: NodeEntry<TableCellNode> | undefined | null

	private constructor(
		private options: SlateTableOptions,
		private editor: Editor,
		private tableNode: NodeEntry<TableNode> | undefined,
		private rowNode: NodeEntry<TableRowNode> | undefined,
		private cellNode: NodeEntry<TableCellNode> | undefined,
		private matrix: ReturnType<typeof Table['createMatrix']>
	) {}

	get table() {
		if (!this.tableNode) {
			throw new Error('Not in a table')
		}

		return { node: this.tableNode[0], path: this.tableNode[1] }
	}

	get row() {
		if (!this.rowNode) {
			throw new Error('Not in a row')
		}

		return { node: this.rowNode[0], path: this.rowNode[1] }
	}

	get cell() {
		if (!this.cellNode) {
			throw new Error('Not in a cell')
		}

		return { node: this.cellNode[0], path: this.cellNode[1] }
	}

	get rows() {
		return this.table.node.children
	}

	get prevCell() {
		if (this._prevCell) return this._prevCell

		const current = this.cell

		if (current.node !== this.row.node.children.at(0)) {
			this._prevCell = this.getPreviousSibling(this.editor, current.path, isTableCellNode)
		} else if (!this.isFirstRow()) {
			const prevRow = this.getPreviousSibling(this.editor, this.row.path, isTableRowNode)

			if (!prevRow) {
				return null
			}

			const prevCell = Node.last(prevRow?.[0], prevRow?.[1])

			if (isTableCellNodeEntry(prevCell, this.options.blocks)) {
				this._prevCell = prevCell
			}
		}

		return this._prevCell
	}

	get nextCell() {
		if (this._nextCell) return this._nextCell

		const { matrix, cell: current } = this
		const coord = this.getCellCoordinates(current.node).first()
		let x = coord?.get('x')
		let y = coord?.get('y')

		if (y === null || y === undefined || x === null || x === undefined) {
			return null
		}

		while (matrix.has(y) && matrix.get(y)?.has(x)) {
			if (matrix.get(y)?.get(x)?.get('ref')?.[0] !== current.node) {
				this._nextCell = matrix.get(y)?.get(x)?.get('ref')
				break
			}

			// If we reached the end of the row, start again at the next one
			if (++x === matrix.get(y)?.size) {
				x = 0
				y++
			}
		}

		return this._nextCell
	}

	getCellAbove() {
		if (this._cellAbove) return this._cellAbove
		if (this.isFirstRow()) return null
		const { matrix, cell } = this
		const pos = this.getCellCoordinates(cell.node).first()

		let x = pos?.get('x')
		let y = pos?.get('y')

		if (y === null || y === undefined || x === null || x === undefined) {
			return null
		}

		while (y-- > 0) {
			if (!matrix.has(y)) return
			if (matrix.get(y)?.get(x)?.get('ref')?.[0] !== cell.node) {
				this._cellAbove = matrix.get(y)?.get(x)?.get('ref')
				break
			}
		}
		return this._cellAbove
	}

	getCellBelow() {
		if (this._cellBelow) return this._cellBelow
		if (this.isLastRow()) return null
		const { matrix, cell } = this
		const pos = this.getCellCoordinates(cell.node).first()

		let y = pos?.get('y')
		let x = pos?.get('x')

		if (y === null || y === undefined || x === null || x === undefined) {
			return null
		}

		while (y++ < matrix.size) {
			if (!matrix.has(y)) return
			if (matrix.get(y)?.get(x)?.get('ref')?.[0] !== cell.node) {
				this._cellBelow = matrix.get(y)?.get(x)?.get('ref')
				break
			}
		}
		return this._cellBelow
	}

	getCellCoordinates(cell: TableCellNode) {
		const { matrix } = this

		const coords: Record<{ x: number | null; y: number | null }>[] = []

		matrix.forEach((row, rowIdx) =>
			row.forEach((r, colIdx) => {
				if (r.get('ref')?.[0] === cell) {
					coords.push(new Coordinates({ x: colIdx, y: rowIdx }))
				}
			})
		)
		return List(coords)
	}

	/**
	 * Check to see if this position is within a cell
	 */
	isInCell() {
		return Boolean(this.cellNode)
	}

	/**
	 * Check to see if this position is within a row
	 */
	isInRow() {
		return Boolean(this.rowNode)
	}

	/**
	 * Check to see if this position is within a table
	 */
	isInTable() {
		return Boolean(this.tableNode)
	}

	/**
	 * Get count of columns
	 */
	getWidth(row: TableRowNode | null = null) {
		const { table } = this
		let cells: TableCellNode[] | undefined

		if (row) {
			cells = row.children
		} else {
			const rows = table.node.children
			cells = rows.at(0)?.children
		}

		return cells?.reduce((acc, c) => acc + getCellColspan(c), 0)
	}

	/**
	 * Get count of rows
	 */
	getHeight() {
		const { table } = this
		const rows = table.node.children

		return rows.reduce((acc, r) => acc + getCellRowspan(r), 0)
	}

	/**
	 * Get index of current row in the table.
	 */
	getRowIndex() {
		const { table, row } = this
		const rows = table.node.children

		return rows.findIndex((x) => x === row.node)
	}

	getCellStartColumn() {
		const { cell } = this
		return List(this.row.node.children)
			.takeUntil((c) => c === cell.node)
			.reduce((acc, c) => acc + getCellColspan(c), 0)
	}

	/**
	 * True if on first row
	 */
	isFirstRow() {
		return this.getRowIndex() === 0
	}

	/**
	 * True if on last row
	 */
	isLastRow() {
		return this.getRowIndex() === this.getHeight() - 1
	}

	private getPreviousSibling<T extends Node>(
		editor: Editor,
		path: Path,
		assertNode: (value: unknown, blocks: Blocks) => value is T
	): NodeEntry<T> | null {
		let previousSiblingPath: Path

		try {
			previousSiblingPath = Path.previous(path)
		} catch (error) {
			// Unable to calculate `Path.previous`, which means there is no previous sibling.
			return null
		}

		if (Node.has(editor, previousSiblingPath)) {
			const node = Node.get(editor, previousSiblingPath)

			if (!assertNode(node, this.options.blocks)) {
				return null
			}

			return [node, previousSiblingPath]
		}

		return null
	}
}
