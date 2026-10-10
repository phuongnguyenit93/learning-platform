Every VarHandle has:

- a **variable type** `T`: the type stored in each referenced variable;
- **coordinate types**: values required to identify one concrete variable.

Instance-field example:

```text
class Counter { int value; }

VarHandle for Counter.value

variable type:
int

coordinate types:
(Counter)
```

Array element:

```text
int[] array

variable type:
int

coordinate types:
(int[], int)
          ↑ index
```

Thinking in coordinates makes the signatures of `get`, `set`, and `compareAndSet` predictable instead of something to memorize.
