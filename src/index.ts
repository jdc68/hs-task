import * as readline from "node:readline";
export { canReachValue, gcd, egcd, ceilDiv, floorDiv };

type EGCD = { divisor: bigint; x: bigint; y: bigint };

// find the greatest common divisor of a and b
function gcd(a: bigint, b: bigint): bigint {
    // overwrite b with remainder from division until remainder = 0
    while (b !== 0n) {
        const rem = a % b;
        a = b;
        b = rem;
    }

    // if remainder == 0 then we consider a the greatest common divisor
    return a;
}

// calculates a * x + b * y = gcd(a, b) (euclid algorithm)
function egcd(a: bigint, b: bigint): EGCD {
    // if b == 0 then gcd(a, 0) = a
    // so, we get a*1 + 0*0 = a
    if (b === 0n)
        return {
            divisor: a,
            x: 1n,
            y: 0n
        };

    // calculate recursively because gcd(a,b) = gcd(b, a%b), so we make the values smaller with each iteration
    // by replasing a with b and b with a%b
    const r = egcd(b, a % b);
    return {
        divisor: r.divisor,
        x: r.y,
        y: r.x - (a / b) * r.y,
    };
}

// divide two bigint values and round the result to closest bigger integer number
function ceilDiv(n: bigint, d: bigint): bigint {
    if (n >= 0n) return (n + d - 1n) / d;
    return -((-n) / d);
}

// divide two bigint values and round the result to closest smaller integer number
function floorDiv(n: bigint, d: bigint): bigint {
    if (n >= 0n) return n / d;
    return -ceilDiv(-n, d);
}

function canReachValue(a: bigint, b: bigint, c: bigint): boolean {
    // result will be true if the one of the values is already equal to c
    if (c === a || c === b)
        return true;

    // result will be false if c is smaller than a or b because a and be will never become smaller.
    if (c < a && c < b)
        return false;

    // c should have the greatest common divisor as a and b
    const divisor = gcd(a, b);
    if (c % divisor !== 0n)
        return false;

    // bring all the values to their common divisor
    const A = a / divisor;
    const B = b / divisor;
    const C = c / divisor;

    const { x, y } = egcd(A, B);

    // we know that A * x + B * y = 1. If we multiply everything by C we get equasion A(x * C) + B(y * C) = C
    // so the equasion solution will be A*u0 + B*y0 = C
    let u0 = x * C;
    let v0 = y * C;

    // solution can be written using parameter t:
    // u = u0 + B * t
    // v = v0 - A * t
    // now we need to find such t that u and v are not negative
    const tMin = ceilDiv(-u0, B);
    const tMax = floorDiv(v0, A);

    // if there is no valid t in this range, then solution is impossible
    if (tMin > tMax)
        return false;

    // try all possible t values in the allowed range
    for (let t = tMin; t <= tMax; t++) {

        // calculate current coefficients
        const u = u0 + B * t;
        const v = v0 - A * t;

        // to get a valid solution u and v must be non negative
        // and gcd(u, v) must be 1
        if (u >= 0n && v >= 0n && gcd(u, v) === 1n)
            return true;
    }

    return false;
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

console.log("Please input values for a b c (use spaces in between):");

rl.on("line", (line) => {
    const parts = line.trim().split(/\s+/);

    if (parts.length !== 3) {
        console.log("There should be exactly 3 numbers present");
        console.log("Please input values for a b c (use spaces in between):");
        return;
    }

    try {
        const a = BigInt(parts[0]);
        const b = BigInt(parts[1]);
        const c = BigInt(parts[2]);

        const result = canReachValue(a, b, c) ? "YES" : "NO";
        console.log(result);
    } catch {
        console.log("Input values are not valid");
    }

    console.log("Please input values for a b c (use spaces in between):");
});