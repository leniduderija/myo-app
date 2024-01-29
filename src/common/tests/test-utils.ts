import { VueWrapper } from '@vue/test-utils'

export const getActionsCellButtons = async (wrapper: VueWrapper) => {
  const tableRows = await wrapper.findAll('tbody tr')
  const firstRow = tableRows[0]
  const cells = firstRow.findAll('td')
  return cells[4].findAll('a')
}
