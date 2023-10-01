export function IsNullOrEmpty(value) {
  return (
    value === null ||
    value === undefined ||
    value === '' ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && Object.keys(value).length === 0)
  );
}

export function IsNotNullOrEmpty(value) {
  return !IsNullOrEmpty(value);
}
