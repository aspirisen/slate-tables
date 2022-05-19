import { createHyperscript } from 'slate-hyperscript'

export const h = createHyperscript({
	elements: {
		table: { type: 'table' },
		tr: { type: 'table-row' },
		td: { type: 'table-cell' },
		paragraph: { type: 'paragraph' },
		li: { type: 'li' },
		ul: { type: 'ul' }
	}
})

export default h
