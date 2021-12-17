"use strict";
exports.__esModule = true;
exports.twinPrimesBelow = exports.primesBelow = exports.isPrime = exports.factorialAll = exports.factorial = exports.test = exports.fibAllObject = exports.fibAllArray = exports.fibRecursive = void 0;
var fibRecursive = function (n) { return n > 1 ? (0, exports.fibRecursive)(n - 1) + (0, exports.fibRecursive)(n - 2) : 1; };
exports.fibRecursive = fibRecursive;
var fibAllArray = function (n) {
    var result = [1, 1];
    for (var i = 2; i <= n; i++) {
        result.push(result.slice(-1)[0] + result.slice(-2)[0]);
    }
    return result;
};
exports.fibAllArray = fibAllArray;
var fibAllObject = function (n) {
    var result = { 0: 1, 1: 1 };
    for (var i = 2; i <= n; i++) {
        result[i] = result[i - 1] + result[i - 2];
    }
    return result;
};
exports.fibAllObject = fibAllObject;
var test = function (n) { return Array.from({ length: n }).map(function (t, i) { return i; }); };
exports.test = test;
var factorial = function (n) { return n > 1 ? n * (0, exports.factorial)(n - 1) : 1; };
exports.factorial = factorial;
var factorialAll = function (n) {
    var result = { 1: 1 };
    for (var i = 2; i <= n; i++) {
        result[i] = i * result[i - 1];
    }
    return result;
};
exports.factorialAll = factorialAll;
var isPrime = function (n) {
    for (var i = 2, s = Math.sqrt(n); i <= s; i++)
        if (n % i === 0)
            return false;
    return n > 1;
};
exports.isPrime = isPrime;
var primesBelow = function (max) {
    var result = [];
    for (var i = max - 1; i > 0; i--) {
        (0, exports.isPrime)(i) && result.push(i);
    }
    return result;
};
exports.primesBelow = primesBelow;
var twinPrimesBelow = function (max) {
    var p = (0, exports.primesBelow)(max).reverse();
    return p.filter(function (t, i) { return (t - p[i - 1] === 2) || (p[i + 1] - t === 2); })
        .reduce(function (result, v, i, array) {
        if (!(i % 2)) {
            result.push(array.slice(i, i + 2));
        }
        return result;
    }, []);
};
exports.twinPrimesBelow = twinPrimesBelow;
// command line logic
var actions = {
    fib: exports.fibRecursive,
    fibAllArray: exports.fibAllArray,
    fibAllObject: exports.fibAllObject,
    test: exports.test,
    isPrime: exports.isPrime,
    primesBelow: exports.primesBelow,
    twinPrimesBelow: exports.twinPrimesBelow,
    factorial: exports.factorial,
    factorialAll: exports.factorialAll
};
var action = process.argv.slice(2)[0];
var args = process.argv.slice(3);
if (!actions[action]) {
    console.log('Valid Functions: ', Object.keys(actions));
    return;
}
var result = actions[action].apply(actions, args);
console.log('result', result);
//testing;
