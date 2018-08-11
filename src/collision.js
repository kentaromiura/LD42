//function checks if bullets collide particular object
function checkCollision(bullets, object) {

  var i = 0;
  for (i = 0; i < bullets.length; i++) {
    const bulletX = bullets[i].x;
    const bulletY = bullets[i].y;
    const bulletW = bullets[i].w;
    const bulletH = bullets[i].h;

    const objectX = object.x;
    const objectY = object.y;
    const objectW = object.w;
    const objectH = object.h;

    //check if two rectangles intersect
    return bulletX + bulletW >= objectX && bulletX <= objectX + objectW &&
      bulletY + bulletH >= objectY && bulletY <= objectY + objectH;

  }
}