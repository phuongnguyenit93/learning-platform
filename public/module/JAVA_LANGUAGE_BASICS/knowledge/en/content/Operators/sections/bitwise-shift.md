Integer types support `&`, `|`, `^`, `~`, `<<`, `>>`, and `>>>`.

`>>` performs sign-preserving arithmetic right shift; `>>>` zero-fills. Shift distances are also masked according to the operand width.

Bit-level code benefits from explicit tests around sign and width boundaries.

```java
int flags = 0b0101;
int mask  = 0b0001;
boolean enabled = (flags & mask) != 0;
```

Bitmasks are appropriate for low-level/protocol/compact representations; ordinary business state is often clearer with enums or sets.
