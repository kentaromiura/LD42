export default global.requestAnimationFrame ||
  global.webkitRequestAnimationFrame ||
  global.mozRequestAnimationFrame ||
  global.oRequestAnimationFrame ||
  global.msRequestAnimationFrame ||
  function(callback) {
    setTimeout(function() {
      callback(+new Date());
    }, 1e3 / 60);
  };
