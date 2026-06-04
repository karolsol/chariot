export function omitEmptyFields<T extends Record<string, any>>(
  obj: T,
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => {
      if (value == null) return false;
      if (typeof value === "string") return value.trim() !== "";
      return true;
    }),
  ) as Partial<T>;
}
