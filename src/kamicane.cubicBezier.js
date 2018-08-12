var get = function(one, two, three, four, t) {

    var v = 1 - t,
        b1 = t * t * t,
        b2 = 3 * t * t * v,
        b3 = 3 * t * v * v,
        b4 = v * v * v

    return four * b1 + three * b2 + two * b3 + one * b4
}

var clamp = function(n, min, max) {
    if (n < min) return min
    if (n > max) return max
    return n
}

var bezier = function(vectors, epsilon) {

    if (vectors.length % 3 !== 1) throw new Error("invalid input")

    for (var i = 0; i < vectors.length - 1; i += 3) {

        var c0 = vectors[i],
            c1 = vectors[i + 1],
            c2 = vectors[i + 2],
            c3 = vectors[i + 3]

        if (i === 0) c0.x = 0 // clamp the first 0 to x 0
        else c0.x = clamp(c0.x, 0, 1)

        if (i === vectors.length - 4) c3.x = 1
        else c3.x = clamp(c3.x, c0.x, 1)

        // clamp the rest
        c1.x = clamp(c1.x, c0.x, c3.x)
        c2.x = clamp(c2.x, c0.x, c3.x)
    }

    return function(x) {

        var c0, c1, c2, c3

        for (var i = 0; i < vectors.length - 1; i += 3) {
            c0 = vectors[i]
            c1 = vectors[i + 1]
            c2 = vectors[i + 2]
            c3 = vectors[i + 3]
            if (x >= c0.x && x <= c3.x) break
        }

        var lower = 0, upper = 1, t = x, xt

        if (x < lower) return get(c0.y, c1.y, c2.y, c3.y, lower)
        if (x > upper) return get(c0.y, c1.y, c2.y, c3.y, upper)

        while (lower < upper) {
            xt = get(c0.x, c1.x, c2.x, c3.x, t)
            if (Math.abs(xt - x) < epsilon) return get(c0.y, c1.y, c2.y, c3.y, t)
            if (x > xt) lower = t
            else upper = t
            t = (upper - lower) * 0.5 + lower
        }

        // Failure
        return get(c0.y, c1.y, c2.y, c3.y, t)

    }

}

export default bezier;

// use with http://kamicane.github.io/equation-designer/
// or http://requirebin.com/?gist=kentaromiura/b7509d6bec83783be37b
// (This is an old version because kamicane is too lazy to update his projects)
