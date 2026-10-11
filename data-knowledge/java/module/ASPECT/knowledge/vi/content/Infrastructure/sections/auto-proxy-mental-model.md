Mental model đơn giản hóa:

```text
Bean definition
    ↓
bean instance được tạo
    ↓
BeanPostProcessor infrastructure
    ↓
Spring tìm Advisor phù hợp
    ↓
nếu cần
→ trả AOP proxy thay cho raw bean reference
```

Một family infrastructure quan trọng là:

```text
AbstractAutoProxyCreator
```

Với `@AspectJ` support, runtime thường có một auto-proxy creator cụ thể chịu trách nhiệm biến Aspect metadata thành Advisor candidate và quyết định bean nào cần proxy.

Không nên hardcode class name cụ thể của auto-proxy creator vào business logic vì đó là framework infrastructure.
