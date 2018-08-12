// Highly inspired (copy/pasted) by kamicane/transition
import raf from "./raf";

function Transition(duration, equation, onStep, onEnd) {
  if (!duration) throw new Error("no duration given");
  if (!equation) throw new Error("no equation given");
  if (!onStep) throw new Error("no onStep given");

  this.duration = duration;
  this.equation = equation;
  this.onStep = onStep;
  this.onEnd = onEnd || function() {};
  this.step = this.step.bind(this);
}

function queue(fn) {
  raf(fn);
  return function() {
    this.elapsed = this.duration;
  };
}

Transition.prototype = {
  get paused() {
    return this.cancel == null && this.elapsed != null;
  },

  get active() {
    return this.cancel != null;
  },

  get idle() {
    return this.cancel == null && this.elapsed == null;
  },

  start: function() {
    if (this.idle) {
      this.elapsed = 0;
      this.cancel = queue(this.step);
    }
    return this;
  },

  step: function(time) {
    this.elapsed += time - (this.time || time);

    var factor = this.elapsed / this.duration;
    if (factor > 1) factor = 1;

    if (factor !== 1) {
      // keep calling step
      this.time = time;
      this.cancel = queue(this.step);
    } else {
      // end of the animation
      this.cancel = this.time = this.elapsed = null;
      queue(this.onEnd);
    }

    var delta = this.equation(factor);
    this.onStep(delta);
  },

  stop: function() {
    if (this.active) {
      this.cancel();
      this.elapsed = this.cancel = this.time = null;
    }
    return this;
  },

  pause: function() {
    if (this.active) {
      this.cancel();
      this.cancel = this.time = null;
    }
    return this;
  },

  loop: function() {
    var loop = this;
    loop.onEnd = function() {
      loop.start();
    };
    loop.start();
    return {
      cancel: function() {
        loop.onEnd = function() {};
        loop.cancel();
      }
    };
  },

  resume: function() {
    if (this.paused) {
      this.cancel = queue(this.step);
    }
    return this;
  }
};

export default Transition;
