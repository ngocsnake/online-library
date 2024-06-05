export const objectToParams = (obj: any) => {
  if (!obj) {
    return "";
  }

  const updatedParams = new URLSearchParams("");
  Object.entries(obj).forEach(([key, value]: any) => {
    if (value === null || value === undefined || value === "") {
      updatedParams.delete(key);
    } else {
      updatedParams.set(key, value);
    }
  });

  return updatedParams.toString();
};
