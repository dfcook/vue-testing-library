// TypeScript Version: 4.0

import Vue, {ComponentOptions} from 'vue'
import {ThisTypedMountOptions, VueClass} from '@vue/test-utils'
import {Store, StoreOptions} from 'vuex'
import Router, {RouteConfig} from 'vue-router'
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  queries,
  EventType,
  BoundFunctions,
  prettyFormat,
} from '@testing-library/dom'

// NOTE: fireEvent is overridden below
export * from '@testing-library/dom'

export function cleanup(): void

export interface RenderResult extends BoundFunctions<typeof queries> {
  container: Element
  baseElement: Element
  debug: (
    baseElement?:
      | Element
      | DocumentFragment
      | Array<Element | DocumentFragment>,
    maxLength?: number,
    options?: prettyFormat.OptionsReceived,
  ) => void
  unmount(): void
  isUnmounted(): boolean
  html(): string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emitted(): {[name: string]: any[][]}
  updateProps(props: object): Promise<void>
}

export interface RenderOptions<V extends Vue, S = {}>
  // The props and store options special-cased by Vue Testing Library and NOT passed to mount().
  extends Omit<ThisTypedMountOptions<V>, 'store' | 'props'> {
  props?: object
  store?: StoreOptions<S>
  routes?: RouteConfig[] | Router
  container?: Element
  baseElement?: Element
}

export type ConfigurationCallback<V extends Vue> =
  | ((
      localVue: typeof Vue,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      store: Store<any>,
      router: Router,
    ) => Partial<ThisTypedMountOptions<V>>)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | ((localVue: typeof Vue, store: Store<any>, router: Router) => void)

export function render<V extends Vue>(
  TestComponent: VueClass<V> | ComponentOptions<V>,
  options?: RenderOptions<V>,
  configure?: ConfigurationCallback<V>,
): RenderResult

export type AsyncFireObject = {
  [K in EventType]: (
    element: Document | Element | Window,
    options?: {},
  ) => Promise<void>
}

export interface VueFireEventObject extends AsyncFireObject {
  (element: Document | Element | Window, event: Event): Promise<void>
  touch(element: Document | Element | Window): Promise<void>
  update(element: HTMLOptionElement): Promise<void>
  update(
    element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
    value: string,
  ): Promise<void>
  update(element: Element, value?: string): Promise<void>
}

export const fireEvent: VueFireEventObject
