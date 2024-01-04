declare namespace jest {
    interface Matchers<R> {
      toHaveValue(expected: string): R;
    }
  }