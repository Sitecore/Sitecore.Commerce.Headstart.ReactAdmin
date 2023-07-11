/**
 * Gets the union type of all the values in an object
 *
 * ex:
 * type Props = { name: string; age: number; visible: boolean };
 * Expect: string | number | boolean
 */
export type ValuesType<T> = T[keyof T]
