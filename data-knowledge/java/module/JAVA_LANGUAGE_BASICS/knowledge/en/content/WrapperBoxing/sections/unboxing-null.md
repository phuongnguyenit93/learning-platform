Wrappers may be `null`:

```java
Integer boxed = null;
int value = boxed; // NullPointerException
```

Unboxing requires an actual wrapper object from which to extract a primitive value.

The failure can be hidden inside larger expressions:

```java
Integer count = null;
int x = count;
int y = count + 1;
if (count > 0) { }
```

If null is valid domain state, handle absence before unboxing. If it is invalid, validate at the boundary rather than allowing a distant NPE.

The next chapter examines operators and implicit promotions inside expressions.
