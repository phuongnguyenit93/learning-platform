Java source is written in `.java` files. A source file can contain a package declaration, imports, and one or more type declarations subject to Java's language rules.

```java
package demo;

import java.util.List;

public class App {
    public static void main(String[] args) {
        System.out.println("Hello");
    }
}
```

At a foundational level, read the structure from the outside inward:

```text
source file
→ package/import
→ type declaration
→ member
→ method/constructor body
→ statement/expression
```

Packages and imports are only identified here so the learner can read a source file. Namespace behavior, name resolution, and package-level access are covered in a later milestone.
