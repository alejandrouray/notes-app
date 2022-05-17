const average = (arr) => {
  if (Array.isArray(arr) && !arr.length) return 0;
  if (typeof arr === 'undefined') return;
  return arr.reduce((a, b) => a + b) / arr.length;
};

module.exports = { average };
