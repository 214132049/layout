module.exports = {
  uuid () {
    return parseInt(`${Date.now() + Math.random() * 1000}`, 10).toString(8)
  }
};
