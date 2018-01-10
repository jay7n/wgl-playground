const PI = 3.1415926

function angleToRadian(angle) {
    return PI * angle / 180
}

function radianToAngle(radian) {
    return 180 * radian / PI
}

export {
    PI,
    angleToRadian,
    radianToAngle,
}
