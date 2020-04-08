import '@testing-library/jest-dom'
import Vue from 'vue'
import {render, fireEvent} from '@testing-library/vue'
import Vuetify from 'vuetify'
import VuetifyDemoComponent from './components/Vuetify'

// We need to use a global Vue instance, otherwise Vuetify will complain about
// read-only attributes.
// This could also be done in a custom Jest-test-setup file to execute for all tests.
// More info: https://github.com/vuetifyjs/vuetify/issues/4068
//            https://vuetifyjs.com/en/getting-started/unit-testing
Vue.use(Vuetify)

// Custom container to integrate Vuetify with Vue Testing Library.
// Vuetify requires you to wrap your app with a v-app component that provides
// a <div data-app="true"> node.
const renderWithVuetify = (component, options, callback) => {
  const root = document.createElement('div')
  root.setAttribute('data-app', 'true')

  return render(
    component,
    {
      container: document.body.appendChild(root),
      // for Vuetify components that use the $vuetify instance property
      vuetify: new Vuetify(),
      ...options,
    },
    callback,
  )
}

test('should set [data-app] attribute on outer most div', () => {
  const {container} = renderWithVuetify(VuetifyDemoComponent)

  expect(container.attributes.getNamedItem('data-app')).toBeDefined()
})

test('renders a Vuetify-powered component', async () => {
  const {getByText} = renderWithVuetify(VuetifyDemoComponent)

  await fireEvent.click(getByText('open'))

  expect(getByText('Lorem ipsum dolor sit amet.')).toMatchInlineSnapshot(`
    <div
      class="v-card__text"
    >
      Lorem ipsum dolor sit amet.
    </div>
  `)
})

test('allows changing props', async () => {
  const {queryByText, updateProps} = renderWithVuetify(VuetifyDemoComponent)

  expect(queryByText('This is a hint')).not.toBeInTheDocument()

  await updateProps({showHint: true})

  expect(queryByText('This is a hint')).toBeInTheDocument()
})

test('opens a menu', async () => {
  const {getByText, queryByText} = renderWithVuetify(VuetifyDemoComponent)

  await fireEvent.click(getByText('menu'))

  const menuItem = queryByText('menu item')
  expect(menuItem).toBeInTheDocument()

  await fireEvent.click(menuItem)
  expect(queryByText('menu item')).not.toBeInTheDocument()
})
