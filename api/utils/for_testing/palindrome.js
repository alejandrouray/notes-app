const palindrome = (str) => {
  if (typeof str === 'undefined') return;

  return str
    .split('')
    .reverse()
    .join('');
};

module.exports = { palindrome };
