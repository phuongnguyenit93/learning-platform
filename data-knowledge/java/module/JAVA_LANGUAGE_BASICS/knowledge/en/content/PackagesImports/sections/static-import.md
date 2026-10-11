Static imports allow an unqualified use of a static member:

```java
import static java.lang.Math.max;
```

They can improve readability when the member's origin is obvious, but overuse can make source ownership unclear.

Static imports may target fields or methods:

```java
import static java.lang.Math.PI;
import static java.lang.Math.max;
```

They do not change access control; the imported member must still be accessible.
