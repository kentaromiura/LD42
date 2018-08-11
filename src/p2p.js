import Peer from 'peerjs';

export default () =>
  new Promise(resolve => {
    const cbs = [];
    const conns = [];
    const register = (conn) => {
      conns.push(conn);
      conn.on('data', (data) => {
        cbs.forEach(cb => cb(JSON.parse(data)));
      });
    };
    var peer = new Peer();
    peer.on('open', (id) => {
      console.log('My peer ID is: ' + id);

      fetch(`https://gamebroker.herokuapp.com/ld42/join?id=${id}`)
        .then(res => res.json())
        .then((res) => {
          if (res.clients) {
            res.clients.forEach(client =>
              register(peer.connect(client))
            )
          }
          peer.on('connection', (conn) => register(conn));
          resolve({
            emit: (data) => {
              conns.forEach(conn => {
                conn.send(JSON.stringify(data));
              });
            },
            cb: (cb) => {
              cbs.push(cb);
            }
          });
        });
    });
  })
