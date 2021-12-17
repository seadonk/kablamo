export const fibRecursive = (n: number): number => n > 1 ? fibRecursive(n - 1) + fibRecursive(n - 2) : 1;

export const fibAllArray = (n: number): number[] => {
    const result = [1, 1];
    for (let i = 2; i <= n; i++) {
        result.push(result.slice(-1)[0] + result.slice(-2)[0]);
    }
    return result;
}

export const fibAllObject = (n: number): number[] => {
    const result = { 0: 1, 1: 1 };
    for (let i = 2; i <= n; i++) {
        result[i] = result[i - 1] + result[i - 2];
    }
    return result;
}

export const test = (n: number): number[] => Array.from({ length: n }).map((t, i) => i);

export const factorial = (n: number): number => n > 1 ? n * factorial(n - 1) : 1;

export const factorialAll = (n: number): any => {
    const result = { 1: 1 };
    for (let i = 2; i <= n; i++) {
        result[i] = i * result[i - 1];
    }
    return result;
}

export const isPrime = (n: number): boolean => {
    for (let i = 2, s = Math.sqrt(n); i <= s; i++)
        if (n % i === 0) return false;
    return n > 1;
}

export const factorsOf = (n: number): number[] => {
    const result = [];
    for (let i = 2, s = Math.floor(n / 2); i <= s; i++) {
        !(n % i) && result.push(i);
    }
    return result;
}

export const primeFactorization = (n: number, result = {}): any => {
    if (isPrime(n)) {
        result[n] = (result[n] || 0) + 1;
        return result;
    }

    const a = factorsOf(n).slice(-1)[0]
    const b = n / a;
    primeFactorization(b, result);
    primeFactorization(a, result);
    return result;
}

export const primesBelow = (max: number) => {
    const result = [];
    for (let i = max - 1; i > 0; i--) {
        isPrime(i) && result.push(i);
    }
    return result;
}

export const twinPrimesBelow = (max: number) => {
    const p = primesBelow(max).reverse();
    return p.filter((t, i) => (t - p[i - 1] === 2) || (p[i + 1] - t === 2))
        .reduce((result, v, i, array) => {
            if (!(i % 2)) { result.push(array.slice(i, i + 2); }
            return result;
        }, []);
}


// command line logic
const actions = {
    fib: fibRecursive,
    fibAllArray,
    fibAllObject,
    test,
    isPrime,
    primesBelow,
    twinPrimesBelow,
    factorial,
    factorialAll,
    factorsOf,
    primeFactorization
}

const action: string = process.argv.slice(2)[0];
const args = process.argv.slice(3);
if (!actions[action]) { console.log('Valid Functions: ', Object.keys(actions)); return; }
const result = actions[action](...args);
console.log('result', result);