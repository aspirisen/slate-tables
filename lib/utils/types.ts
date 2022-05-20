import { Node, Path } from 'slate'

export interface NodePath<T extends Node> {
	node: T
	path: Path
}
