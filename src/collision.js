//function checks if bullets collide particular object
export default function checkCollision(bullets, object) {
  return bullets.find(bullet => {
    const bulletX = bullet.x;
    const bulletY = bullet.y;
    const bulletW = bullet.w;
    const bulletH = bullet.h;

    const objectX = object.x;
    const objectY = object.y;
    const objectW = object.w;
    const objectH = object.h;

    //check if two rectangles do not intersect
    return (
      bulletX + bulletW >= objectX &&
      bulletX <= objectX + objectW &&
      bulletY + bulletH >= objectY &&
      bulletY <= objectY + objectH
    );
  });
}
