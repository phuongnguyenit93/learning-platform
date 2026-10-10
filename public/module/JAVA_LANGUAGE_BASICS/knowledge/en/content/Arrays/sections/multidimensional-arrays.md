Java multidimensional arrays are **arrays of arrays**, so jagged shapes are valid.

Do not assume they are one contiguous rectangular matrix representation.

Rows may have different lengths or even be `null`:

```java
int[][] data = new int[3][];
data[0] = new int[2];
data[1] = new int[5];
// data[2] is still null
```

Nested loops should therefore use each row's own `length` and honor the nullability contract for rows.

The next chapter uses arrays as the foundation for varargs and then explains how data crosses a method-call boundary.
