An argument may use conversions permitted in method-invocation context, including identity conversion, primitive/reference widening, boxing/unboxing in applicable phases, and eventually varargs conversion.

Not every explicit cast that is legal in source is automatically performed by overload resolution.

```java
void use(long value) { }
use(10); // int widens to long

void useByte(byte value) { }
int x = 1;
// useByte(x); // no implicit narrowing
useByte((byte) x);
```
