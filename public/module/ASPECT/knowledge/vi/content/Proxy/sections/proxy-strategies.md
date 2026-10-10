Hai chiến lược proxy cần phân biệt:

```text
JDK Dynamic Proxy
→ proxy dựa trên interface

Class-based / CGLIB Proxy
→ proxy là subclass của target class
```

Ở fundamentals chỉ cần biết strategy ảnh hưởng type surface và limitation của proxy.

Experiment tạo **cả hai strategy bằng code** nằm ở:

```text
readme/vi/menu/11.ProxyFactory/ProxyFactory.md
ProgrammaticProxyController#compareProxyFactoryStrategies()
```

---
