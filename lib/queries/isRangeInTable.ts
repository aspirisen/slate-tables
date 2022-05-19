import { Editor } from 'slate'
import type { BaseRange } from 'slate'
import type { ReactEditor } from 'slate-react'

export default function isRangeInTable(options, editor: ReactEditor, range: BaseRange) {
	if (!range) {
		return false
	}

	try {
		const startPosition = editor.getTableAtKey(start.key)
		const endPosition = editor.getTableAtKey(end.key)
		return startPosition.table === endPosition.table
	} catch {
		return false
	}
}
