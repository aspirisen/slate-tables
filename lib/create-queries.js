import isInTable from './queries/isInTable'
import isRangeInTable from './queries/isRangeInTable'
import getTableAtKey from './queries/getTableAt'
import getCellAtKey from './queries/getCellAtKey'
import getRowAtKey from './queries/getRowAtKey'
import canIncreaseColspanAtKey from './queries/canIncreaseColspanAtKey'
import canIncreaseRowspanAtKey from './queries/canIncreaseRowspanAtKey'
import canDecreaseColspanAtKey from './queries/canDecreaseColspanAtKey'
import canDecreaseRowspanAtKey from './queries/canDecreaseRowspanAtKey'
import getColumnPropertiesAtKey from './queries/getColumnPropertiesAtKey'

export default (options, editor) => {
	editor.isInTable = isInTable.bind(null, options, editor)
	editor.isRangeInTable = isRangeInTable.bind(null, options, editor)
	editor.getTableAtKey = getTableAtKey.bind(null, options, editor)
	editor.getCellAtKey = getCellAtKey.bind(null, options, editor)
	editor.getRowAtKey = getRowAtKey.bind(null, options, editor)
	editor.canIncreaseColspanAtKey = canIncreaseColspanAtKey.bind(null, options, editor)
	editor.canIncreaseRowspanAtKey = canIncreaseRowspanAtKey.bind(null, options, editor)
	editor.canDecreaseColspanAtKey = canDecreaseColspanAtKey.bind(null, options, editor)
	editor.canDecreaseRowspanAtKey = canDecreaseRowspanAtKey.bind(null, options, editor)
	editor.getColumnPropertiesAtKey = getColumnPropertiesAtKey.bind(null, options, editor)
}
