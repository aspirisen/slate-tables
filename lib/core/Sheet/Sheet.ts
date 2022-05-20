import { Editor, Location, Node, NodeEntry, Path } from 'slate'
import { List, Record } from 'immutable'
import findLast from 'lodash.findlast'
import { NodePath } from '#utils/types'
import { TableEditor } from '#core'
import { TableNode, TableRowNode, TableCellNode } from '#nodes'
import { Matrix, createMatrix } from './createMatrix'

const Coordinates = Record<{ x: number; y: number }>({ x: 0, y: 0 })

export class Sheet {
	static create(editor: TableEditor, location: Location) {
		const currentNode = Editor.node(editor, Editor.path(editor, location))
		const ancestors = Array.from(Node.ancestors(editor, Editor.path(editor, location)))
		const allPossibleNodes = [currentNode].concat(ancestors)

		const tableNodeEntry = findLast(allPossibleNodes, ([node]) => TableNode.isTableNode(editor, node))
		const rowNodeEntry = findLast(ancestors, ([node]) => TableRowNode.isTableRowNode(editor, node))
		const cellNodeEntry = findLast(ancestors, ([node]) => TableCellNode.isTableCellNode(editor, node))

		if (
			TableNode.isTableNodeEntry(editor, tableNodeEntry) &&
			TableRowNode.isTableRowNodeEntry(editor, rowNodeEntry) &&
			TableCellNode.isTableCellNodeEntry(editor, cellNodeEntry)
		) {
			const matrix = createMatrix(editor, { node: tableNodeEntry[0], path: tableNodeEntry[1] })
			return new Sheet(editor, tableNodeEntry, rowNodeEntry, cellNodeEntry, matrix)
		}

		return null
	}

	private _prevCell: NodePath<TableCellNode> | undefined
	private _nextCell: NodePath<TableCellNode> | undefined
	private _cellAbove: NodePath<TableCellNode> | undefined
	private _cellBelow: NodePath<TableCellNode> | undefined

	private constructor(
		private editor: TableEditor,
		private tableNode: NodeEntry<TableNode> | undefined,
		private rowNode: NodeEntry<TableRowNode> | undefined,
		private cellNode: NodeEntry<TableCellNode> | undefined,
		private matrix: Matrix
	) {}

	get table(): NodePath<TableNode> {
		if (!this.tableNode) {
			throw new Error('Not in a table')
		}

		return { node: this.tableNode[0], path: this.tableNode[1] }
	}

	get row(): NodePath<TableRowNode> {
		if (!this.rowNode) {
			throw new Error('Not in a row')
		}

		return { node: this.rowNode[0], path: this.rowNode[1] }
	}

	get cell(): NodePath<TableCellNode> {
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
			this._prevCell = this.getPreviousSibling(this.editor, current.path, TableCellNode.isTableCellNode)
		} else if (!this.isFirstRow()) {
			const prevRow = this.getPreviousSibling(this.editor, this.row.path, TableRowNode.isTableRowNode)

			if (!prevRow) {
				return null
			}

			const prevCell = Node.last(prevRow?.node, prevRow?.path)

			if (TableCellNode.isTableCellNodeEntry(this.editor, prevCell)) {
				this._prevCell = { node: prevCell[0], path: prevCell[1] }
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
			if (matrix.get(y)?.get(x)?.get('ref')?.node !== current.node) {
				this._nextCell = matrix.get(y)?.get(x)?.get('ref') ?? undefined
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
			if (matrix.get(y)?.get(x)?.get('ref')?.node !== cell.node) {
				this._cellAbove = matrix.get(y)?.get(x)?.get('ref') ?? undefined
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
			if (matrix.get(y)?.get(x)?.get('ref')?.node !== cell.node) {
				this._cellBelow = matrix.get(y)?.get(x)?.get('ref') ?? undefined
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
				if (r.get('ref')?.node === cell) {
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

		return cells?.reduce((acc, c) => acc + TableCellNode.getCellColspan(c), 0)
	}

	/**
	 * Get count of rows
	 */
	getHeight() {
		const { table } = this
		const rows = table.node.children

		return rows.reduce((acc, r) => acc + TableCellNode.getCellRowspan(r), 0)
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
			.reduce((acc, c) => acc + TableCellNode.getCellColspan(c), 0)
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
		assertNode: (editor: TableEditor, value: Node | undefined) => value is T
	): NodePath<T> | undefined {
		let previousSiblingPath: Path

		try {
			previousSiblingPath = Path.previous(path)
		} catch (error) {
			// Unable to calculate `Path.previous`, which means there is no previous sibling.
			return undefined
		}

		if (Node.has(editor, previousSiblingPath)) {
			const node = Node.get(editor, previousSiblingPath)

			if (!assertNode(this.editor, node)) {
				return undefined
			}

			return { node, path: previousSiblingPath }
		}

		return undefined
	}
}
