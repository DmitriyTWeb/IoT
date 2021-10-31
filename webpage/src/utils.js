/* eslint-disable comma-dangle */
// eslint-disable-next-line import/prefer-default-export
export const extend = (a, b) => ({ ...a, ...b });

const capitalize = (str) => {
  if (typeof str !== 'string') {
    return '';
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const kebabToCamelCase = (str) => {
  let strParts = str.split('-');
  strParts = [].concat(
    strParts[0],
    strParts.slice(1).map((part) => capitalize(part))
  );

  return strParts.join('');
};
