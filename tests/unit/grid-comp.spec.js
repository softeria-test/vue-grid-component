import GridComp from '@/components/GridComp/GridComp.vue'
import {
  createTable,
  isHeader,
  isHeaderLeaf,
  isHidden,
  alignment,
  sortDirectionClass,
  sorted
} from '@/components/GridComp/features/features'
import { shallowMount } from '@vue/test-utils'
import stachRowOrganizedPackage from './fixtures/stach-row-organized-package.json'

describe('GridComp.vue', () => {
  let table = null

  beforeEach(() => {
    table = stachRowOrganizedPackage.tables.main
  })

  it('renders component properly', async () => {
    const wrapper = shallowMount(GridComp)

    await wrapper.setProps({ table })

    expect(wrapper.text()).toMatch('Example Row Organized Stach Table')
  })

  it('renders correct count of tr elements', async () => {
    const wrapper = shallowMount(GridComp)

    await wrapper.setProps({ table })

    expect(wrapper.findAll('tr').length).toEqual(18)
  })

  it('renders correct count of th elements (excluding hidden ones)', async () => {
    const wrapper = shallowMount(GridComp)

    await wrapper.setProps({ table })

    expect(wrapper.findAll('th').length).toEqual(12)
  })

  it('renders correct count of td elements (excluding hidden ones)', async () => {
    const wrapper = shallowMount(GridComp)

    await wrapper.setProps({ table })

    expect(wrapper.findAll('td').length).toEqual(105)
  })

  it('renders correct rowspan for the first th element', async () => {
    const wrapper = shallowMount(GridComp)

    await wrapper.setProps({ table })

    expect(wrapper.find('th').attributes('rowspan')).toEqual('3')
  })

  it('renders correct colspan for the second th element', async () => {
    const wrapper = shallowMount(GridComp)

    await wrapper.setProps({ table })

    expect(wrapper.findAll('th').at(1).attributes('colspan')).toEqual('2')
  })

  it('renders correct text-align for the second td element', async () => {
    const wrapper = shallowMount(GridComp)

    await wrapper.setProps({ table })

    expect(wrapper.findAll('td').at(1).attributes('style')).toMatch(/text-align:\s?right/i)
  })

  it('renders correct padding-left for the div of 22nd td element', async () => {
    const wrapper = shallowMount(GridComp)

    await wrapper.setProps({ table })

    expect(wrapper.findAll('td').at(21).find('div').attributes('style')).toMatch(/padding-left:\s?1em/)
  })

  describe('sorting feature', () => {
    it('renders initial sort arrows as ascending order', async () => {
      const wrapper = shallowMount(GridComp)

      await wrapper.setProps({ table })

      expect(
        wrapper.findAll('span.arrow').wrappers.every(wrapper2 => wrapper2.classes('asc') && !wrapper2.classes('dsc'))
      ).toBeTruthy()
    })

    it('renders a sort arrow as opposite after it is clicked', async () => {
      const wrapper = shallowMount(GridComp)

      await wrapper.setProps({ table })

      // Get the first arrow
      const firstArrowWrapper = wrapper.find('span.arrow')
      // Click the arrow
      await firstArrowWrapper.trigger('click')

      expect(firstArrowWrapper.classes('dsc')).toBeTruthy()
    })

    it('sorts in descending order', async () => {
      const wrapper = shallowMount(GridComp)

      await wrapper.setProps({ table })

      // Get the first arrow
      const firstArrowWrapper = wrapper.find('span.arrow')
      // Click the arrow
      await firstArrowWrapper.trigger('click')

      // The second td should be 100 now
      expect(wrapper.findAll('td').at(1).text()).toEqual('100')
    })

    it('sorts in ascending order', async () => {
      const wrapper = shallowMount(GridComp)

      await wrapper.setProps({ table })

      // Get the first arrow
      const firstArrowWrapper = wrapper.find('span.arrow')
      // Click the arrow twice to achieve ascending sorting
      firstArrowWrapper.trigger('click')
      await firstArrowWrapper.trigger('click')

      // The second td should be 0.15 now
      expect(wrapper.findAll('td').at(1).text()).toEqual('0.15')
    })
  })

  describe('feature functions', () => {
    describe('createTable function', () => {
      it('return a deep clone of given table', () => {
        const myTable = createTable(table, true)

        expect(myTable.definition.columns).not.toBe(table.definition.columns)
      })

      it('adds isOrderedAsc properties to leaf headers', () => {
        const myTable = createTable(table, true)

        expect(myTable.data.rows[2].headerCellDetails[0].isOrderedAsc).not.toBeUndefined()
      })

      it('does not add isOrderedAsc properties to non-leaf headers', () => {
        const myTable = createTable(table, true)

        expect(myTable.data.rows[0].headerCellDetails[0].isOrderedAsc).toBeUndefined()
      })
    })

    describe('isHeader function', () => {
      it('returns true if given row is a header', () => {
        expect(isHeader(table.data.rows[0])).toBeTruthy()
      })

      it('returns false if given row is not a header', () => {
        expect(isHeader(table.data.rows[3])).toBeFalsy()
      })
    })

    describe('isHeaderLeaf function', () => {
      it('returns if a header is a leaf or not', () => {
        expect(isHeaderLeaf(table.data.rows[0], 0)).toBeFalsy()
        expect(isHeaderLeaf(table.data.rows[0], 1)).toBeFalsy()
        expect(isHeaderLeaf(table.data.rows[2], 0)).toBeTruthy()
      })
    })

    describe('isHidden function', () => {
      it('returns if a column is hidden or not', () => {
        expect(isHidden(table, table.data.rows[0], 2)).toBeTruthy()
        expect(isHidden(table, table.data.rows[0], 3)).toBeFalsy()
      })
    })

    describe('alignment function', () => {
      it('returns alignment of a column', () => {
        expect(alignment(table, table.data.rows[2], 0, 'horizontal')).toEqual('RIGHT')
      })

      it('returns undefined if no alignment is defined for a column', () => {
        expect(alignment(table, table.data.rows[0], 3, 'horizontal')).toBeUndefined()
      })
    })

    describe('sortDirectionClass function', () => {
      it('returns undefined if given row is not a header leaf', () => {
        expect(sortDirectionClass(table.data.rows[0], 0)).toBeUndefined()
      })

      it('returns "asc" if given header row is ordered ascending', () => {
        table.data.rows[2].headerCellDetails[0].isOrderedAsc = true
        expect(sortDirectionClass(table.data.rows[2], 0)).toEqual('asc')
      })

      it('returns "dsc" if given header row is ordered descending', () => {
        table.data.rows[2].headerCellDetails[0].isOrderedAsc = false
        expect(sortDirectionClass(table.data.rows[2], 0)).toEqual('dsc')
      })
    })

    describe('sorted function', () => {
      it('returns a deep clone of given rows', () => {
        const sortedRows = sorted(table.data.rows, 0, true)
        // Assert that the first row is not sorted because it is a header
        expect(sortedRows[0].cells).not.toBe(table.data.rows[0].cells)
      })

      it('sorts ascending order', () => {
        const sortedRows = sorted(table.data.rows, 0, true)
        expect(sortedRows[3].cells[1]).toEqual(0.15)
      })

      it('sorts descending order', () => {
        const sortedRows = sorted(table.data.rows, 0, false)
        expect(sortedRows[3].cells[1]).toEqual(100)
      })

      it('orders null values at the end when sorted ascending order', () => {
        const sortedRows = sorted(table.data.rows, 0, true)
        expect(sortedRows[sortedRows.length - 1].cells[1]).toBeNull()
      })

      it('orders null values at the end when sorted ascending order', () => {
        const sortedRows = sorted(table.data.rows, 0, false)
        expect(sortedRows[sortedRows.length - 1].cells[1]).toBeNull()
      })
    })
  })
})
