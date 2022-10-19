module.exports = (str) => {
  str.replaceAll("\\", "\\\\");
  str.replaceAll("'", "\\'");
  str.replaceAll('"', '\\"');
  return str;
};
