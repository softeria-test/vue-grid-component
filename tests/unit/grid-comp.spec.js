import GridComp from '@/components/GridComp.vue'
import { shallowMount } from '@vue/test-utils'
import stachRowOrganizedPackage from './fixtures/stach-row-organized-package.json'

describe('GridComp.vue', () => {
  let table = null

  beforeEach(() => {
    table = stachRowOrganizedPackage.tables.main
  })

  it('renders component properly', async () => {
    const wrapper = shallowMount(GridComp, {
      propsData: { table }
    })

    expect(wrapper.text()).toMatch('Example Row Organized Stach Table')
  })

  it('renders correct count of tr elements', () => {
    const wrapper = shallowMount(GridComp, {
      propsData: { table }
    })

    expect(wrapper.findAll('tr').length).toEqual(18)
  })

  it('renders correct count of th elements (excluding hidden ones)', () => {
    const wrapper = shallowMount(GridComp, {
      propsData: { table }
    })

    expect(wrapper.findAll('th').length).toEqual(12)
  })

  it('renders correct count of td elements (excluding hidden ones)', () => {
    const wrapper = shallowMount(GridComp, {
      propsData: { table }
    })

    expect(wrapper.findAll('td').length).toEqual(105)
  })

  it('renders correct rowspan for the first th element', () => {
    const wrapper = shallowMount(GridComp, {
      propsData: { table }
    })

    expect(wrapper.find('th').attributes('rowspan')).toEqual('3')
  })

  it('renders correct colspan for the second th element', () => {
    const wrapper = shallowMount(GridComp, {
      propsData: { table }
    })

    expect(wrapper.findAll('th').at(1).attributes('colspan')).toEqual('2')
  })

  it('renders correct text-align for the second td element', () => {
    const wrapper = shallowMount(GridComp, {
      propsData: { table }
    })

    expect(wrapper.findAll('td').at(1).attributes('style')).toMatch(/text-align:\s?right/i)
  })

  it('renders correct padding-left for the div of 22nd td element', () => {
    const wrapper = shallowMount(GridComp, {
      propsData: { table }
    })

    expect(wrapper.findAll('td').at(21).find('div').attributes('style')).toMatch(/padding-left:\s?1em/)
  })
})
