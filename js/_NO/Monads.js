class Maybe {
    static just(value) {
        return new Just(value);
    }
    static nothing() {
        return new Nothing();
    }
    get isJust() {
        return false;
    }
    get isNothing() {
        return false;
    }
    static of(value) {
        return Maybe.just(value);
    }
    static fromNullable(value) {
        return value !== null ? Maybe.just(value) : Maybe.nothing();
    }
}
class Just extends Maybe {
    constructor(value) {
        super();
        this._value = null;
        this._value = value;
    }
    get value() {
        return this._value;
    }
    get isJust() {
        return true;
    }
    map(f) {
        return Maybe.fromNullable(f(this._value) || null);
    }
    getOrElse() {
        return this._value;
    }
}
class Nothing extends Maybe {
    get value() {
        throw new TypeError('Can´t extract the value ot the Nothing');
    }
    get isNothing() {
        return true;
    }
    map() {
        return this;
    }
    getOrElse(other) {
        return other;
    }
}
class Either {
    constructor(value) {
        this._value = null;
        this._value = value;
    }
    static right(value) {
        return new Right(value);
    }
    static left(value) {
        return new Left(value);
    }
    static of(value) {
        return Either.right(value);
    }
    static fromNullable(value) {
        return value !== null ? Either.right(value) : Either.left(value);
    }
}
class Right extends Either {
    get value() {
        return this._value;
    }
    map(f) {
        return Either.fromNullable(f(this._value) || null);
    }
    orElse() {
        return this;
    }
    getOrElseThrow() {
        return this._value;
    }
}
class Left extends Either {
    get value() {
        throw new TypeError('Can´t extract the value of the Left');
    }
    map() {
        return this;
    }
    orElse(f) {
        return f(this._value);
    }
    getOrElseThrow(a) {
        return new Error(a);
    }
}
class IO {
    constructor(effect) {
        this._effect = null;
        if (typeof effect !== 'function') {
            throw 'IO: function required';
        }
        this._effect = effect;
    }
    static of(value) {
        return new IO(() => value);
    }
    static from(fn) {
        return new IO(fn);
    }
    map(fn) {
        const self = this;
        return new IO(function () {
            return fn(self._effect());
        });
    }
    run() {
        return this._effect();
    }
}
class Functor {
    constructor(value) {
        this.__value = null;
        this.__value = value;
    }
    static of(value) {
        return new Functor(value);
    }
    isNothing() {
        return (this.__value === null || this.__value === undefined);
    }
    map(fn) {
        return this.isNothing() ? Functor.of(null) : Functor.of(fn(this.__value));
    }
    join() {
        if (!(this.__value instanceof Functor)) {
            return this.__value;
        }
        return this.__value.join();
    }
}
class PFTool {
    static curry(fn, ...args) {
        return (...args2) => {
            args = args.concat(args2);
            if (args.length >= fn.length) {
                return fn(...args);
            }
            return PFTool.curry(fn, ...args);
        };
    }
    static compose(fn, ...funcs) {
        return (...args) => {
            return funcs.reduce((acc, func) => func(acc), fn(...args));
        };
    }
}
