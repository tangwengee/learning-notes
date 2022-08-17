# Functional Programming (Foundational)
Personal learning notes taken from reading 
1. Mastering JavaScript Functional Programming - Second Edition by Federico Kereki
2. MDN Web Docs

## Scope

1. What is Functional Programming
2. Why Function Programming
3. Functional Programming paradigm
    1. Pure Functions
    2. Higher-order functions
    3. map, reduce, filter
    4. Immutability
    5. Recursion
    6. Currying

### Pure Functions

### Higher-order Functions

### map, reduce, filer

### Immutability
Minimize side effects through immutability. Straightforward techniques to disallow side effects (mutation):

1. Avoid mutator functions
2. Use `const` declarations instead of `let`
3. Freeze objects
4. Clone objects
5. Use getters and setters // examples to be provided
6. Use lenses to access and set attributes // examples to be provided

#### Avoid mutator functions

JavaScript mutators

1. `copyWithin()` lets you copy elements within the array.
2. `fill()` fills an array with a given value.
3. `push()` and `pop()` let you add or delete elements at the end of an array.
4. `shift()` and `unshift()` work in the same way as `push()` and `pop()`, but at the beginning of the array.
5. `splice()` lets you add or delete elements anywhere within the array.
6. `reverse()` and `sort()` modify the array in place, reversing its elements or ordering them.

```typescript
/* Example of how .sort() and .pop() mutates original array */
const array_1 = [4, 2, 1, 5, 3];

const array_2 = array_1.sort().pop();

console.log("array_1", array_1); // [1,2,3,4]
console.log("array_2", array_2); // 5
```

```typescript
/* Using .slice() or spread operator to create copies of array */
const array_1 = [4, 2, 1, 5, 3];

const array_3 = array_1.slice().sort().pop();
const array_4 = [...array_1].sort().pop();

console.log("array_1", array_1); // [4,2,1,5,3]
console.log("array_3", array_3); // 5
console.log("array_4", array_4); // 5
```

#### Use `const` declarations instead of `let`

In JavaScript, a const definition means that the reference to the object or array cannot change (you cannot assign a
different object to it) but you can still modify the properties of the object itself.

```typescript
const obj_1 = {alpha: 1, beta: 99};
console.log(obj_1); // {alpha: 1, beta: 99}

obj_1 = {alpha: 12, beta: 4}; // Uncaught TypeError: Assignment to constant variable.

obj_1.alpha = 121; // but this is fine
obj_1.beta = 7;
console.log(obj_1); // {alpha: 121, beta: 7}
```

Safe against direct assignment to objects and arrays, but changing an attribute or array element is not prevented.

#### Freeze objects

After an object has been frozen, any attempts at modifying it will silently fail — JavaScript won't report an error or
throw an exception, but it won't alter the object either. Unless written in TypeScript / "use strict", then it will
throw exception

```typescript
const obj_2 = {omega: 22, theta: 9};
Object.freeze(obj_2);

obj_2.omega = 12; // TypeError: Cannot assign to read only property 'omega' of object '#<Object>'
obj_2.theta = 4;

```

Problem: .freeze() is a _shallow_ operation that freezes the attributes. If any attributes are objects or arrays
themselves, they can still be modified.

```typescript
const obj_2 = {omega: {a: 1, b: 5}, theta: [1]};
Object.freeze(obj_2);

obj_2.omega.a = 222; // opps, this works
obj_2.theta[0] = 777; // opps this works

console.log(obj_2); // {"omega": {"a": 222, "b": 5}, "theta": 777} 
```

To make object truly immutable, recursively freeze each property which is of type object (array is also an object in JS)
. Use this on case-by-case basis.

- Avoid using on object that references itself to avoid endless loop
- Avoid using on object that shouldn't be frozen, such as [window]

```typescript
function deepFreeze(object: any) {
    const propNames = Object.getOwnPropertyNames(object);

    for (const name of propNames) {
        const value = object[name];
        if (value && typeof value === "object") {
            deepFreeze(value);
        }
    }
    return Object.freeze(object);
}

const obj_2 = {omega: {a: 1, b: 5}, theta: [1]};
deepFreeze(obj_2);

obj_2.omega.a = 222; // Throw exception
obj_2.theta[0] = 777; // Throw exception
```

#### Clone objects

If mutating an object is not allowed, we can create a new object.

```typescript
/* Cloning by hand */
const oldObject = {
    d: 22,
    o: {c: "MVD", f: {a: 56}}
};

const newObject = {
    d: oldObject.d,
    o: {c: oldObject.o.c, f: {a: oldObject.o.f.a}}
};
```

```typescript
/* Shallow copy of object - lower attributes are still mutable*/
const oldObject = {
    d: 22,
    o: {c: "MVD", f: {a: 56}}
};
const newObject1 = Object.assign({}, oldObject);
const newObject2 = {...oldObject};

/* Shallow copy of array */
const oldArray = [1, 2, 3, 4];
const newArray_1 = oldArray.slice();
const newArray_2 = [...oldArray];
```

```typescript
/* Deep copy method 1 */
const oldObject = ["noodles", {"list": ["eggs", "flour", "water"]}];
const object_deepcopy_1 = JSON.parse(JSON.stringify(oldObject));
const object_deepcopy_2 = structuredClone(oldObject);

/* Deep copy method 2 */
// write custom function.....

/* Deep copy method 3 */
// Use libraries such as lodash cloneDeep, AngularJS copy, just-clone etc.
```

### Recursion

### Currying

Currying is the process of transforming an _m_-ary function (that is, a function of arity m) into a sequence of _m_
unary functions, each of which receives one argument of the original function, from left to right. (The first function
receives the first argument of the original function, and returns a second function that receives the second argument,
and returns a third function that receives the third argument, and so on.) Upon being called with an argument, each
function produces the next one in the sequence, and the last one does the actual calculations.

- arity - number of arguments or operands taken by a function
- unary - the simplest numeral system to represent natural numbers;

Suppose we have a function that calculate VAT for an amount. The following code example would make sense if rate is
dynamic per calculation.

```typescript
const addVAT = (rate, amount) => amount * (1 + rate / 100);

addVAT(20, 500); // 600 -- that is, 500 + 20%
addVAT(15, 200); // 230 -- 200 +15%
```

If we are to apply a constant rate, we can curry addVAT() function to produce a single source of truth for the rate.

```typescript
/* Written in arrow function */
const addVATcurried = (rate: number) => (amount: number) => amount * (1 + rate / 100);
const addNationalVAT = addVATcurried(6);
console.log(addNationalVAT(1500)); // 1590 -- 1500 + 6%

/* Written in regular function */
function addVATcurried_2(rate: number) {
   return function (amount: number) {
      return amount * (1 + rate / 100)
   }
}

const addNationalVAT_2 = addVATcurried_2(6);
console.log(addNationalVAT_2(1500)); // 1590 -- 1500 + 6%
```

1. Currying by hand
2. Currying with bind()
3. Currying with eval()

#### Currying by hand

```typescript
const sum = (x, y) => {
   if (x !== undefined && y !== undefined) { // If there are two argumments, it adds them
      return x + y;
   } else if (x !== undefined && y == undefined) { // If there are one argument, it returns a new function which expects a single argument
      return z => sum(x, z);
   } else { // Returns itself if no arguments
      return sum;
   }
};
```

#### Currying with bind()

```typescript
const curryByBind = fn =>
  fn.length === 0 ? fn() : p => curryByBind(fn.bind(null, p));
```

```typescript
/* When the number of parameter is not fixed, we can pass the desired number of arguments */
const curryByBindWithLength = (fn, len = fn.length) =>
        len === 0 ? fn() : p => curryByBindWithLength(fn.bind(null, p), len - 1);

const sum2 = (...args) => args.reduce((x, y) => x + y, 0);
sum2.length; // 0; curryByBind() wouldn't work

sum2(1, 5, 3); // 9
sum2(1, 5, 3, 7); // 16
sum2(1, 5, 3, 7, 4); // 20

curriedSum5 = curryByBindWithLength(sum2, 5); // curriedSum5 will expect 5 parameters
curriedSum5(1)(5)(3)(7)(4); // 20
```

Testing currying function 

```typescript
const sum2 = (...args) => args.reduce((x, y) => x + y, 0);

describe("with curryByBindWithLength", function () {
   it("should fix arguments one by one", () => {
      const sumA = curryByBindWithLength(sum2, 5);
      const sumB = sumA(1)(2)(3)(4)(5);
      expect(sumB).toBe(sum2(1, 2, 3, 4, 5));
   });

   it("should work with arity 1", () => {
      const sumA = curryByBindWithLength(sum2, 1);
      const sumB = sumA(111);
      expect(sumB).toBe(sum2(111));
   });
});
```

#### Currying with eval()
Skipped for now...
