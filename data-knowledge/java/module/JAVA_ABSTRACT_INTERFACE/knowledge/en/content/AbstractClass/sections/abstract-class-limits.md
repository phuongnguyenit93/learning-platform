`abstract` only prevents direct instantiation. An abstract class is still a valid reference type:

```java
BasePayment payment = new CardPayment();
```

The larger structural constraint is that a Java class may extend only **one class**. If a capability must cross unrelated class hierarchies, forcing every implementation under one abstract base class creates unnecessary coupling.

That leads directly to interfaces: **what if we need a common contract without committing every implementation to one class hierarchy?**
