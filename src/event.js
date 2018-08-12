const global = new Function("return this")();

const unwrapDetail = handler => event => handler(event.detail);

const Event = {
  on(event, handler) {
    global.addEventListener(event, unwrapDetail(handler));
  },
  fire(event, args) {
    global.dispatchEvent(
      new CustomEvent(event, {
        detail: args
      })
    );
  }
};

export default Event;
