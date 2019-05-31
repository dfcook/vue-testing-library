import 'jest-dom/extend-expect'

import VuexTest from './components/VuexTest'
import { render, fireEvent } from 'vue-testing-library'

const store = {
  state: {
    count: 0
  },
  actions: {
    increment: ({ commit, state }) => commit('SET_COUNT', state.count + 1),
    decrement: ({ commit, state }) => commit('SET_COUNT', state.count - 1)
  },
  mutations: {
    SET_COUNT: (state, count) => { state.count = count }
  }
}

test('can render with vuex with defaults', async () => {
  const { getByTestId, getByText } = render(VuexTest, { store })
  await fireEvent.click(getByText('+'))

  expect(getByTestId('count-value')).toHaveTextContent('1')
})

test('can render with vuex with custom initial state', async () => {
  store.state.count = 3
  const { getByTestId, getByText } = render(VuexTest, { store })
  await fireEvent.click(getByText('-'))

  expect(getByTestId('count-value')).toHaveTextContent('2')
})

test('can render with vuex with custom store', async () => {
  // this is a silly store that can never be changed
  jest.spyOn(console, 'error').mockImplementation(() => {})

  const store = { state: { count: 1000 } }
  const { getByTestId, getByText } = render(VuexTest, { store })

  await fireEvent.click(getByText('+'))
  expect(getByTestId('count-value')).toHaveTextContent('1000')

  await fireEvent.click(getByText('-'))
  expect(getByTestId('count-value')).toHaveTextContent('1000')

  expect(console.error).toHaveBeenCalled()
})
