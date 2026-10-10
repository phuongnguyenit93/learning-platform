Two proxy strategies must be distinguished:

```text
JDK Dynamic Proxy
→ interface-based proxy

Class-based / CGLIB Proxy
→ proxy is a subclass of the target class
```

At the fundamentals level, it is enough to know that the strategy affects the proxy's type surface and interception limitations.

The experiment that creates **both strategies programmatically** is located at:

```text
readme/en/menu/11.ProxyFactory/ProxyFactory.md
ProgrammaticProxyController#compareProxyFactoryStrategies()
```

---
