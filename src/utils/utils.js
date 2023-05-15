
let unstringString = (string) => {
  if(!string) return undefined;

  return string.replaceAll('"', '');
}

module.exports = {unstringString}