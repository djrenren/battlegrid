import 'react'

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    ongesturechange?: (any) => void,
    ongestureend?: (any) => void,
    ongesturestart?: (any) => void,
  }
}