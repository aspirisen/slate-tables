/** @jsx h */

import { h } from 'testutils/hyperscript'

export default () => {}

export const value = (
	<value>
		<document>
			<table>
				<tr>
					<td>
						<text />
					</td>
				</tr>
			</table>
		</document>
	</value>
)

export const output = (
	<value>
		<document>
			<table>
				<tr>
					<td>
						<paragraph>
							<text />
						</paragraph>
					</td>
				</tr>
			</table>
		</document>
	</value>
)
