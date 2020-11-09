function log(message) {
    console.log(message);
}

Object.defineProperties(Array.prototype, {
    last: { get: function () { return this[this.length - 1] } },
    hasAny: { get: function () { return Boolean(this.length) } },
});

Array.prototype.takeFirstOut = function () {
    let firstElement = this.shift();
    return firstElement;
}

Array.prototype.discardElements = function () {
    while (this.hasAny)
        this.takeFirstOut();
}

Array.prototype.pickRandomElement = function () {
    let randomIndex = Math.floor(Math.random() * this.length);
    return this[randomIndex];
}

isDefined = function (variable) {
    return typeof variable !== 'undefined';
}

isUndefined = function (variable) {
    return typeof variable === 'undefined';
}