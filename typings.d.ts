declare module '*.vue' {
  import { type DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

/** 设置部分key为required */
type RequiredKeys<T, U> = Required<Pick<T, U>> & Partial<Omit<T, U>>
