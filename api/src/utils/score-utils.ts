import { NotFoundError } from "./api-errors.js";

/**
 * returns filtered object containing only allowed keys from the query (w/ non-empty values).
 * @param query - request query parameters object
 * @param allowedKeys - array of keys to include in result
 */
export const buildFilter = <T extends string>(
  query: Partial<Record<T, string>>,
  allowedKeys: readonly T[] = [],
): Partial<Record<T, string>> => {
  const filter: Partial<Record<T, string>> = {};

  for (const key of allowedKeys) {
    const value = query[key];
    if (value !== undefined && value !== "") {
      filter[key] = value;
    }
  }

  return filter;
};

export const validateExists = async (
  Model: any,
  field: string,
  value: string,
) => {
  if (!value) return;
  const exists = await Model.findOne({ id: value });
  if (!exists) {
    throw new NotFoundError(`${field} '${value}' not found`);
  }
};
