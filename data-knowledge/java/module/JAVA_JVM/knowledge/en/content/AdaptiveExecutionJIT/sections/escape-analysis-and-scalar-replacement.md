Escape analysis tries to determine whether an allocation escapes beyond a scope the compiler can reason about.

If the HotSpot server compiler proves an object is scalar-replaceable, it can eliminate the allocation from generated code and represent the object's state as separate scalar values.

```java
Point p = new Point(x, y);
return p.x() + p.y();
```

The source-level `new` therefore does not guarantee that a physical heap allocation survives until garbage collection. The runtime can transform implementation details as long as program semantics stay the same.

A common misconception is that escape analysis simply “moves the object to the stack.” The Java 21 HotSpot documentation describes scalar replacement/allocation elimination and explicitly notes that the server compiler does not replace a heap allocation with a stack allocation merely because an object does not globally escape.

Counting `new` keywords is not a reliable way to infer real allocation cost.
