This is an **advanced compiler-implementation section**. You do not need to memorize bridge generation to use everyday generics; it matters when reading bytecode/Reflection or explaining why polymorphism still works after erasure.

Erasure can make an overriding method's runtime signature differ from the erased generic contract. The compiler may generate a **synthetic bridge method** to preserve polymorphism.

```java
interface Mapper<T> {
    T map(T value);
}

class StringMapper implements Mapper<String> {
    @Override
    public String map(String value) {
        return value.trim();
    }
}
```

After erasure, the interface contract is conceptually close to:

```java
Object map(Object value)
```

while the real implementation is:

```java
String map(String value)
```

The compiler can add a bridge conceptually like:

```java
public Object map(Object value) {
    return map((String) value);
}
```

Reflection can observe this synthetic/bridge method. It is not a method the developer explicitly wrote.
