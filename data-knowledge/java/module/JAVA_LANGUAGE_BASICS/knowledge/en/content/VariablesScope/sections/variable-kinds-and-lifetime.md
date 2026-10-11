Common categories are:

```text
local variable
→ declared inside a block/method

parameter
→ receives a value when a method/constructor is invoked

instance field
→ per-object state

static field
→ class-level state
```

Local variables and parameters belong to execution frames/blocks; fields belong to object/class state.

Do not confuse the lifetime of a reference variable with the lifetime of the object it references.

### Declaration, initialization, and reassignment

```java
int count;      // declaration
count = 10;     // first assignment
count = 20;     // reassignment

int size = 5;   // declaration + initializer
```

Fields receive default initialization as part of object/class state. Local variables instead rely on definite-assignment analysis.

### Field defaults differ from local-variable rules

```java
class Sample {
    int count;       // 0
    boolean active;  // false
    User user;       // null

    void run() {
        int local;
        // System.out.println(local); // compile error: not definitely assigned
    }
}
```

Default values belong to object/class state initialization. They do not make an unassigned local variable readable, and they are not a substitute for meaningful domain initialization.

### `var` is still static typing

Since Java 10, a local variable with a suitable initializer may use `var`, letting the compiler **infer its static type**:

```java
var count = 10;             // int
var name = "Java";          // String
var user = new User("A");   // User
```

`var` does not make Java dynamically typed and does not mean the variable has no type. Once inferred, the type is fixed for compile-time checking:

```java
var value = "Java";
// value = 10; // invalid: value has static type String
```

The compiler needs an initializer that provides enough type information:

```java
// var x;        // invalid: no initializer
// var y = null; // invalid: no concrete type to infer
```

`var` is primarily syntax for **local-variable type inference**. It does not replace field types, return types, or ordinary method-parameter types.

Use it when the initializer and variable name make the type/intent obvious; prefer an explicit type when inference would make readers guess.

### Scope is not lifetime

```java
User saved;
{
    User local = new User("A");
    saved = local;
}
// local is out of scope, but the object remains reachable through saved
```

Scope asks where a **name is visible in source**. Lifetime/reachability asks how long runtime state remains available. Those are different questions.
