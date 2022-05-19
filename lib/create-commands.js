import {
	insertTable,
	insertTableAtRange,
	insertRow,
	insertRowAtKey,
	insertRowAtEnd,
	insertColumn,
	insertColumnAtKey,
	deleteColumn,
	deleteColumnAtKey,
	deleteTable,
	deleteTableAtKey,
	deleteRowAtKey,
	deleteRow,
	deleteCellsContentAtRange,
	increaseColspanAtKey,
	increaseRowspanAtKey,
	decreaseColspanAtKey,
	decreaseRowspanAtKey,
	setCellProperties,
	setCellPropertiesAtKey,
	setColumnProperties,
	setColumnPropertiesAtIndex,
	setTableProperties,
	setTablePropertiesAtKey
} from './commands'

export default (options, editor) => {
	editor.insertTable = insertTable.bind(null, options, editor)
	editor.insertTableAtRange = insertTableAtRange.bind(null, options, editor)
	editor.insertColumn = insertColumn.bind(null, options, editor)
	editor.insertColumnAtKey = insertColumnAtKey.bind(null, options, editor)
	editor.deleteColumn = deleteColumn.bind(null, options, editor)
	editor.deleteColumnAtKey = deleteColumnAtKey.bind(null, options, editor)
	editor.insertRow = insertRow.bind(null, options, editor)
	editor.insertRowAtEnd = insertRowAtEnd.bind(null, options, editor)
	editor.insertRowAtKey = insertRowAtKey.bind(null, options, editor)
	editor.deleteRowAtKey = deleteRowAtKey.bind(null, options, editor)
	editor.deleteRow = deleteRow.bind(null, options, editor)
	editor.deleteTable = deleteTable.bind(null, options, editor)
	editor.deleteTableAtKey = deleteTableAtKey.bind(null, options, editor)
	editor.deleteCellsContentAtRange = deleteCellsContentAtRange.bind(null, options, editor)
	editor.increaseColspanAtKey = increaseColspanAtKey.bind(null, options, editor)
	editor.increaseRowspanAtKey = increaseRowspanAtKey.bind(null, options, editor)
	editor.decreaseColspanAtKey = decreaseColspanAtKey.bind(null, options, editor)
	editor.decreaseRowspanAtKey = decreaseRowspanAtKey.bind(null, options, editor)
	editor.setCellProperties = setCellProperties.bind(null, options, editor)
	editor.setCellPropertiesAtKey = setCellPropertiesAtKey.bind(null, options, editor)
	editor.setColumnProperties = setColumnProperties.bind(null, options, editor)
	editor.setColumnPropertiesAtIndex = setColumnPropertiesAtIndex.bind(null, options, editor)
	editor.setTableProperties = setTableProperties.bind(null, options, editor)
	editor.setTablePropertiesAtKey = setTablePropertiesAtKey.bind(null, options, editor)
}
