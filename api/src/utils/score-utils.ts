import { NotFoundError } from "./api-errors.js";

export const buildFilter = <T extends string>(
  query: Partial<Record<T, string>>,
  allowedKeys: readonly T[] = []
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
  value: string
) => {
  if (!value) return;
  const exists = await Model.findOne({ id: value });
  if (!exists) {
    throw new NotFoundError(`${field} '${value}' not found`);
  }
};
