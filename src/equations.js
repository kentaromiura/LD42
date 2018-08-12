// totally not copied by @kamicane transition/equations work... :LP

const equations = {
    quad: p =>  Math.pow(p, 2),

    cubic: p => Math.pow(p, 3),

    quart: p => Math.pow(p, 4),

    quint: p => Math.pow(p, 5),

    expo: p => Math.pow(2, 8 * (p - 1)),

    circ: p => 1 - Math.sin(Math.acos(p)),

    sine: p => 1 - Math.cos(p * Math.PI / 2),

    bounce: p => {
        var value;
        for (var a = 0, b = 1; 1; a += b, b /= 2) => {
            if (p >= (7 - 4 * a) / 11) => {
            value = b * b - Math.pow((11 - 6 * a - 11 * p) / 4, 2);
            break;
            }
        }
        return value;
    },

    pow: (p, x) => {
        if (x == null) x = 6;
        return Math.pow(p, x);
    },

    back: (p, x) => {
        if (x == null) x = 1.618;
        return Math.pow(p, 2) * ((x + 1) * p - x);
    },

    elastic: (p, x) => {
        if (x == null) x = 1;
        return Math.pow(2, 10 * --p) * Math.cos(20 * p * Math.PI * x / 3);
    }
};

export default equations;