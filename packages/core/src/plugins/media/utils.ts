export const decodeBase64Image = (base64String: string) => {
  const base64Data = base64String.replace(/^data:.+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');

  return buffer;
};
