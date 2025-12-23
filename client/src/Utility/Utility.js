export const createSearchParamsHelper = (filter) => {
  const queryParams = [];

  for (const [key, value] of Object.entries(filter)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramsvalue = value.join(",");
      queryParams.push(`${key}=${encodeURIComponent(paramsvalue)}`);
    }
  }
  return queryParams.join("&");
};
