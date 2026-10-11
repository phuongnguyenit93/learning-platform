# Enum-Specialized Collections: EnumSet and EnumMap

This chapter completes the **Choosing Implementations and Specialized Collections** milestone. When domain elements or keys come from an `enum`, the valid universe is already known and has a fixed declaration order. `EnumSet` and `EnumMap` exploit exactly that property, making intent clearer than general-purpose structures such as `HashSet` and `HashMap`.

The examples use an order status enum:

```java
enum OrderStatus {
    NEW,
    PAID,
    PACKING,
    SHIPPED,
    CANCELLED
}
```
