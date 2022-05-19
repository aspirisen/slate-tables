import { SyntheticEvent, useState } from 'react'
import { render } from 'react-dom'
import { Editable, RenderElementProps, Slate, withReact } from 'slate-react'
import initialValue from './value'
import { withTable } from '../lib'
import { BaseElement, createEditor, Descendant, Element } from 'slate'

const Button = ({ onClick, children }: any) => {
	const handleClick = (event: SyntheticEvent) => {
		event.preventDefault()
		event.stopPropagation()
		onClick(event)
	}
	const onFocus = (event: SyntheticEvent) => {
		event.preventDefault()
		event.stopPropagation()
	}
	return (
		<button onClick={handleClick} onFocus={onFocus}>
			{children}
		</button>
	)
}

declare module 'slate' {
	interface CustomTypes {
		Element: BaseElement & { type: string }
	}
}

const TableEditor = () => {
	const [value, setValue] = useState<Descendant[]>([initialValue])
	const [editor] = useState(() => withTable(withReact(createEditor() as any)))
	const [_, forceUpdate] = useState(Math.random())

	const renderBlock = (props: RenderElementProps) => {
		if (!Element.isElement(props.element)) {
			return <div></div>
		}

		switch (props.element.type) {
			case 'table':
				return (
					<table {...props.attributes}>
						{/* <colgroup contentEditable={false}>
							{props.element.data.get('columns', []).map((col, index) => (
								<col key={index} width={col.width} />
							))}
						</colgroup> */}
						<tbody>{props.children}</tbody>
					</table>
				)
			case 'table-row':
				return <tr {...props.attributes}>{props.children}</tr>
			case 'table-cell':
				return (
					<td
						{...props.attributes}
						// colSpan={props.node.data.get('colspan', 1)}
						// rowSpan={props.node.data.get('rowspan', 1)}
					>
						{props.children}
					</td>
				)
			case 'paragraph':
				return <p {...props.attributes}>{props.children}</p>
			case 'ul':
				return <ul {...props.attributes}>{props.children}</ul>
			case 'li':
				return <li {...props.attributes}>{props.children}</li>
			default:
				return <div></div>
		}
	}

	console.log('rend')

	return (
		<Slate editor={editor} value={value}>
			<Button onClick={() => editor.insertTable()}>Add table</Button>

			{editor.isInTable() && (
				<div>
					<Button onClick={() => editor.insertColumn()}>Insert column</Button>
					<Button onClick={() => editor.insertRow()}>Insert row</Button>
					<Button onClick={() => editor.insertRowAtEnd()}>Insert row at end</Button>
					<Button onClick={() => editor.deleteRow()}>Delete row</Button>
					<Button onClick={() => editor.deleteColumn()}>Delete column</Button>
					<Button onClick={() => editor.increaseColspanAtKey(editor.value.selection.start.key)}>+ colspan</Button>
					<Button onClick={() => editor.increaseRowspanAtKey(editor.value.selection.start.key)}>+ rowspan</Button>
					<Button
						disabled={!editor || !editor.canDecreaseRowspanAtKey(editor.value.selection.start.key)}
						onClick={() => editor.decreaseRowspanAtKey(editor.value.selection.start.key)}
					>
						- rowspan
					</Button>
					<Button onClick={() => editor.decreaseColspanAtKey(editor.value.selection.start.key)}>- colspan</Button>
					<Button onClick={() => editor.deleteTable()}>Delete table</Button>
				</div>
			)}

			<Editable renderElement={renderBlock} onSelect={() => forceUpdate(Math.random())} />
		</Slate>
	)
}

render(<TableEditor />, document.getElementById('root'))
