import { mount } from '@vue/test-utils'
import Layout from '@/layouts/default.vue'
import Ballot from '@/components/Ballot.vue'

describe('Layout', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(Layout)
    expect(wrapper.vm).toBeTruthy()
  })
})

describe('Ballot', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(Ballot)
    expect(wrapper.vm).toBeTruthy()
  })
})
