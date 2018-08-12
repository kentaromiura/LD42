import Peer from 'peerjs';

export default () =>
  new Promise(resolve => {
    const cbs = {
      'message': [],
      'disconnected': [],
      'new-attendee': [],
      'leave-attendee': []
    };
    const conns = [];
    const register = (conn) => {
      conns.push(conn);
      conn.on('data', (data) => {
        cbs.message.forEach(cb => cb(JSON.parse(data)), conn.peer);
      });
      conn.on('close', () => {
        cbs['leave-attendee'].forEach(cb => cb({
          id: conn.peer
        }));
      });
    };
    var peer = new Peer();
    peer.on('open', (id) => {
      fetch(`https://gamebroker.herokuapp.com/ld42/join?id=${id}`)
        .then(res => res.json())
        .then((res) => {
          if (res.clients) {
            res.clients.forEach(client =>
              register(peer.connect(client))
            )
          }
          peer.on('disconnected', (conn) => {
            cbs.disconnected.forEach(cb => cb(conn.peer));
          });
          peer.on('connection', (conn) => {
            register(conn);
            cbs['new-attendee'].forEach(cb => cb(conn.peer));
          });
          resolve({
            id: id,
            size: () => conns.length,
            disconnect: () => peer.disconnect(),
            to: (to, data) => (conns.find(conn => conn.peer === to) || {send: () => {}}).send(JSON.stringify(data)),
            emit: (data) => {
              conns.forEach(conn => {
                conn.send(JSON.stringify(data));
              });
            },
            on: (type, cb) => {
              cbs[type].push(cb);
            }
          });
        });
    });
  })
