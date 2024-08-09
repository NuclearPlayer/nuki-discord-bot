export const safeParse = (json: string): any => {
  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
};
