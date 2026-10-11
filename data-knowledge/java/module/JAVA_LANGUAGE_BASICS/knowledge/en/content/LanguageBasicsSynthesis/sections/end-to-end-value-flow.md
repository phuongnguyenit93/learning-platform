Take one value and follow it: it may begin as a literal or expression result, be assigned to a variable, converted or boxed, stored in an array, copied into a method parameter through pass-by-value, and finally affect state or a control-flow decision.

Worked example:

```java
static void addBonus(int[] scores, int bonus) {
    if (scores.length > 0) {
        scores[0] = scores[0] + bonus;
    }
}

int base = 10;                    // literal 10 → int variable
int bonus = base + 5;             // expression produces int value 15
int[] scores = {base};            // value 10 is stored in an array element
addBonus(scores, bonus);          // copies the array reference value and primitive value 15
boolean passed = scores[0] > 20;  // visible mutation → boolean expression → later control flow
```

Trace it end to end:

```text
literal 10
→ base = 10
→ base + 5 produces bonus = 15
→ scores[0] starts as 10
→ the call copies the scores reference + primitive 15 into parameters
→ the method mutates the shared array object: scores[0] becomes 25
→ the caller still refers to that array and observes 25
→ scores[0] > 20 produces true
→ that boolean can drive the next control-flow decision
```

This single trace connects declaration, expression evaluation, array mutation, method transfer, pass-by-value, and a control-flow result.

For reference values, always separate two questions:

1. which **reference value** is stored in the variable;
2. what **state** belongs to the referenced object.

That distinction explains assignment, aliasing, mutation, null, array covariance, casting, and many runtime behaviors that beginners otherwise conflate.
