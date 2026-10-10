A primitive variable holds a primitive value directly:

```java
int age = 20;
boolean active = true;
```

A reference variable holds a **reference value** that may identify an object/array or be `null`:

```java
User user = new User();
int[] values = new int[3];
```

Java still copies **values** during assignment and argument passing. For a reference variable, the copied value is the reference value itself.

### WHY - Why this split matters

Many beginner bugs come from assuming every variable "contains an object" in the same way. Primitive assignment copies the primitive value; reference assignment copies the reference value.

```java
int x = 10;
int y = x;
y++;
// x is still 10

User first = new User("A");
User second = first;
second.setName("B");
// first observes the same mutated object
```

Use this mental model:

```text
variable slot → primitive value

or

variable slot → reference value ──→ object
```

Java references are not C/C++ pointers: source code cannot do pointer arithmetic on them.
