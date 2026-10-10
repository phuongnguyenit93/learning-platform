Java could pass behavior before lambda expressions existed. The common technique was an anonymous class implementing an interface:

```java
Comparator<String> byLength = new Comparator<String>() {
    @Override
    public int compare(String left, String right) {
        return Integer.compare(left.length(), right.length());
    }
};
```

This works because the anonymous object has a normal Java type and its `compare` method contains the behavior. The drawback is ceremony: class construction, an override, parameter types, and method syntax surround a very small piece of logic.

Lambdas did not invent behavior passing. They provide a concise language form for supplying an implementation when the target type is a functional interface:

```java
Comparator<String> byLength =
        (left, right) -> Integer.compare(left.length(), right.length());
```

Understanding this relationship helps avoid a common misconception: a lambda is not "a method without a name" floating independently from Java's type system. It still needs a target functional-interface type.
