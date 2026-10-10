Scope determines which name is visible at a source location.

A parameter may shadow a field:

```java
void setName(String name) {
    this.name = name;
}
```

`this.name` is the field; `name` is the parameter.

Legal shadowing is not always readable. Avoid reusing names across nested scopes when it obscures intent.

Block-local variables exist only in the block where their names are in scope:

```java
if (condition) {
    int result = 10;
    System.out.println(result);
}
// result is not visible here
```

Loop initializer variables are similarly scoped:

```java
for (int i = 0; i < 3; i++) {
    System.out.println(i);
}
// i is not visible here
```
