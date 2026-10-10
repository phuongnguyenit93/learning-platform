A static nested class does **not** implicitly retain an outer instance.

```java
class BankAccount {
    static class Builder {
        BankAccount build() {
            return new BankAccount("A-01");
        }
    }
}
```

It behaves much like an ordinary class but lives in the outer class's namespace. It is useful when the nested type is logically related but does not need a particular outer object's state.

It can be created without an outer `BankAccount` instance:

```java
BankAccount.Builder builder = new BankAccount.Builder();
```
