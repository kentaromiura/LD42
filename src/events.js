const events = ["explosion", "projectile"];

return events.reduce((p, c) => {
  p[c] = c;
  return p;
}, {});
