`if/else` is natural for arbitrary boolean conditions. `switch` is useful when one selector is compared against a well-defined set of cases.

Modern Java supports both switch statements and switch expressions.

Choose the structure that makes the decision model easiest to understand, not merely the one with fewer characters.

Java conditions require actual booleans; there is no numeric/reference truthiness:

```java
int count = 1;
// if (count) { } // invalid
if (count > 0) { }
```

Classic colon-style switch statements can fall through unless execution leaves the case. Arrow-style cases avoid accidental fall-through when cases are independent.
