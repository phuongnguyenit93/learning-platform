Erasure prevents overloads that differ only in generic arguments when their erased signatures collide:

```java
// void process(List<String> values) {}
// void process(List<Integer> values) {} // name clash after erasure
```
