import '@testing-library/jest-dom';

declare namespace jest {
  interface Matchers<R> {
    toBeInTheDocument(): R;
    toBeVisible(): R;
    toBeChecked(): R;
    toBeDisabled(): R;
    toBeEnabled(): R;
    toBeEmpty(): R;
    toBeEmptyDOMElement(): R;
    toBeInvalid(): R;
    toBeRequired(): R;
    toBeValid(): R;
    toContainElement(element: HTMLElement | null): R;
    toContainHTML(htmlText: string): R;
    toHaveAccessibleDescription(expectedAccessibleDescription?: string | RegExp): R;
    toHaveAccessibleName(expectedAccessibleName?: string | RegExp): R;
    toHaveAttribute(attr: string, value?: any): R;
    toHaveClass(...classNames: string[]): R;
    toHaveFocus(): R;
    toHaveFormValues(expectedValues: Record<string, any>): R;
    toHaveStyle(css: string | Record<string, any>): R;
    toHaveTextContent(text: string | RegExp, options?: { normalizeWhitespace: boolean }): R;
    toHaveValue(value?: string | string[] | number): R;
    toHaveDisplayValue(value: string | RegExp | (string | RegExp)[]): R;
    toBePartiallyChecked(): R;
    toHaveBeenCalled(): R;
    toHaveBeenCalledTimes(count: number): R;
    toHaveBeenCalledWith(...args: any[]): R;
    toHaveBeenLastCalledWith(...args: any[]): R;
    toHaveBeenNthCalledWith(nth: number, ...args: any[]): R;
    toHaveReturned(): R;
    toHaveReturnedTimes(count: number): R;
    toHaveReturnedWith(value: any): R;
    toHaveLastReturnedWith(value: any): R;
    toHaveNthReturnedWith(nth: number, value: any): R;
    toBe(expected: any): R;
    toEqual(expected: any): R;
    toBeNull(): R;
  }
} 