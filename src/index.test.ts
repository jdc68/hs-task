import { canReachValue, gcd, egcd, ceilDiv, floorDiv } from "./index";

describe("math helpers", () => {
  test("gcd should work", () => {
    expect(gcd(6n, 9n)).toBe(3n);
    expect(gcd(10n, 5n)).toBe(5n);
    expect(gcd(17n, 13n)).toBe(1n);
  });

  test("egcd should satisfy a*x + b*y = gcd(a,b)", () => {
    const a = 240n;
    const b = 46n;
    const r = egcd(a, b);
    expect(a * r.x + b * r.y).toBe(r.divisor);
    expect(r.divisor).toBe(gcd(a, b));
  });

  test("ceilDiv / floorDiv (positive)", () => {
    expect(ceilDiv(10n, 3n)).toBe(4n);
    expect(floorDiv(10n, 3n)).toBe(3n);
    expect(ceilDiv(9n, 3n)).toBe(3n);
    expect(floorDiv(9n, 3n)).toBe(3n);
  });

  test("ceilDiv / floorDiv (negative)", () => {
    expect(ceilDiv(-10n, 3n)).toBe(-3n);
    expect(floorDiv(-10n, 3n)).toBe(-4n);
  });
});

describe("canReachValue", () => {
  test("true when c equals a or b", () => {
    expect(canReachValue(5n, 3n, 5n)).toBe(true);
    expect(canReachValue(5n, 3n, 3n)).toBe(true);
  });

  test("false when c is less than both a and b", () => {
    expect(canReachValue(5n, 3n, 2n)).toBe(false);
    expect(canReachValue(10n, 10n, 9n)).toBe(false);
  });

  test("false when c is not divisible by gcd(a, b)", () => {
    expect(canReachValue(6n, 10n, 9n)).toBe(false);
  });

  test("reachable simple cases", () => {
    expect(canReachValue(6n, 9n, 15n)).toBe(true);

    expect(canReachValue(2n, 4n, 6n)).toBe(true);

    expect(canReachValue(5n, 3n, 8n)).toBe(true);
    expect(canReachValue(5n, 3n, 11n)).toBe(true);
    expect(canReachValue(5n, 3n, 13n)).toBe(true);
  });

  test("unreachable cases", () => {
    expect(canReachValue(6n, 9n, 12n)).toBe(false);

    expect(canReachValue(7n, 5n, 23n)).toBe(false);
    expect(canReachValue(7n, 5n, 24n)).toBe(false);
  });

  test("bigint large c should not crash", () => {
    expect(canReachValue(1n, 1n, 34n)).toBe(true);
    expect(typeof canReachValue(123456789n, 987654321n, 10n ** 30n)).toBe("boolean");
  });
});