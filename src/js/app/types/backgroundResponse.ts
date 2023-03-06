export type backgroundResponse =
  { wasExecuted: boolean }
  | { nextMenuSkip: boolean }
  | { message: 'unknown command' }
  | void
