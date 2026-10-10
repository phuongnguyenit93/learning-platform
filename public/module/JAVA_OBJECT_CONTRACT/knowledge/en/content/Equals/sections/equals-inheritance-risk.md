Inheritance complicates equality when a subtype adds equality-relevant state.

Suppose a parent compares only `x`, while a child also compares `color`:

> The example below intentionally isolates the symmetry problem in `equals`. In a complete class, every class that overrides `equals` must still implement a `hashCode` consistent with its equality state.

```java
class Point {
    final int x;

    Point(int x) {
        this.x = x;
    }

    @Override
    public boolean equals(Object other) {
        return other instanceof Point p && x == p.x;
    }
}

class ColoredPoint extends Point {
    final String color;

    ColoredPoint(int x, String color) {
        super(x);
        this.color = color;
    }

    @Override
    public boolean equals(Object other) {
        return other instanceof ColoredPoint p
                && x == p.x
                && Objects.equals(color, p.color);
    }
}
```

This can produce:

```text
new Point(1).equals(new ColoredPoint(1, "red"))
→ true

new ColoredPoint(1, "red").equals(new Point(1))
→ false
```

Symmetry is broken.

### DESIGN LESSON

For complex value semantics, consider:

- composition instead of arbitrarily open inheritance;
- `final` value classes;
- sealed/closed hierarchies with an explicit equality policy;
- class-based equality when the domain requires exact-type identity.

The goal is not one universal `equals` template. The goal is a **coherent equality relation**.

### TRANSITION

`equals` answers whether two objects represent the same logical value. Hash-based collections also need a cheaper signal to **narrow candidates before calling equality**. That is the role of `hashCode`.
