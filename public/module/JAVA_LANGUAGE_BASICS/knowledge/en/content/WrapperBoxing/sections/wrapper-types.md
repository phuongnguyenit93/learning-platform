Each primitive has a wrapper counterpart:

```text
byte    ↔ Byte
short   ↔ Short
int     ↔ Integer
long    ↔ Long
float   ↔ Float
double  ↔ Double
char    ↔ Character
boolean ↔ Boolean
```

Wrappers are immutable objects. Because they are references, they can be `null`, participate in generic APIs, and have object identity distinct from primitive values.

### WHY - Why wrappers exist

Many APIs require reference types, especially generics:

```java
List<Integer> numbers = new ArrayList<>();
// List<int> is not valid Java
```

Wrappers also expose parsing/conversion helpers:

```java
int value = Integer.parseInt("42");
Integer boxed = Integer.valueOf(42);
```

When nullable/object semantics are unnecessary, primitives are often simpler and avoid boxing overhead.
