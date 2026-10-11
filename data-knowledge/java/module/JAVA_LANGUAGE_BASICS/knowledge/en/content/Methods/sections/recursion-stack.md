Recursive calls create additional stack frames. Missing base cases or excessive depth can result in `StackOverflowError`.

Recursion is natural for some tree/divide-and-conquer algorithms; iterative solutions can be simpler for long linear repetition.

```java
int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}
```

Each recursive call owns a separate stack frame. Java does not guarantee tail-call optimization, so recursion depth remains a real runtime constraint.

The next chapter introduces varargs, Java's syntax for variable argument counts.
