An enum may implement interfaces, letting the closed set of constants act as typed implementations of a capability.

```java
interface FeePolicy {
    int feeFor(int amount);
}

enum FeeTier implements FeePolicy {
    STANDARD {
        public int feeFor(int amount) { return amount / 100; }
    },
    PREMIUM {
        public int feeFor(int amount) { return 0; }
    }
}
```

This is often clearer than a large switch when behavior genuinely belongs to each constant.
