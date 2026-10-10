This is also an **advanced runtime section**. On a first pass, keep the practical rule: runtime cannot always verify a concrete generic argument, which is why generic arrays, casts, and some runtime checks have restrictions.

A **reifiable type** has enough runtime representation for operations that require runtime type checking.

Examples of reifiable types:

```text
String
List
List<?>
int
String[]
List<?>[]
```

Examples of non-reifiable types:

```text
List<String>
List<Integer>
T
List<String>[]
```

Reifiability matters for operations that depend on runtime type information, especially array creation and runtime type checks. For casts, a **non-reifiable target can produce an unchecked cast precisely because the JVM cannot verify the full generic target**. Generic varargs can create a similar boundary where the compiler cannot prove the complete type relationship and heap pollution may result.

### Advanced note — parameterized `instanceof` since Java 16

Do not memorize the overly broad rule that “a parameterized type can never appear after `instanceof`.” This is legal:

```java
List<Integer> values = new ArrayList<>();

if (values instanceof ArrayList<Integer>) {
    // legal
}
```

This does **not** mean the JVM inspected every element to verify `Integer`. The static type `List<Integer>` already carries the `Integer` constraint; the `instanceof` test is refining the runtime class from `List` to `ArrayList`.

Since Java 16, `instanceof` can use some parameterized types when a checked casting conversion exists from the expression's static type to the tested type. Therefore, `non-reifiable` does **not** mean “always forbidden after `instanceof`.”

An unchecked cast may compile even when runtime cannot verify the concrete type argument completely:

```java
List<String> names = (List<String>) value;
```

Treat such a cast as a **trust boundary**, not proof that the runtime checked every generic argument.

Erasure explains many restrictions that otherwise look unrelated. The final chapter groups the major restrictions and shows safer design alternatives.
