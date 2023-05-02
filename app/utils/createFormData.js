export const createFormData = (values, arrayFields = [], config) => {
  const formData = new FormData();

  Object.entries(values).forEach((entryArray) => {
    const key = entryArray[0];
    const value = entryArray[1];
    const processFunc = config[key];
    if (arrayFields.includes(key)) {
      value.forEach((arrayItem) =>
        processFunc
          ? formData.append(key, processFunc(arrayItem))
          : formData.append(key, arrayItem)
      );
    } else formData.append(key, processFunc ? processFunc(value) : value);
  });

  return formData;
};
