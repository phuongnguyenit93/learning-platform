Enums may own data and behavior. For example, an account tier can carry a stable external code:

```java
enum AccountTier {
    STANDARD("STD"),
    PREMIUM("PRM");

    private final String code;

    AccountTier(String code) {
        this.code = code;
    }

    String code() {
        return code;
    }
}
```

Enum constructors are used to build declared constants; application code cannot invoke them directly.
