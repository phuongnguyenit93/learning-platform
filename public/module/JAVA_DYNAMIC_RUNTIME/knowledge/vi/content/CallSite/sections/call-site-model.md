`CallSite` là một object giữ một `MethodHandle target`. Một `invokedynamic` instruction sau khi được link tới CallSite sẽ chuyển lời gọi tới **target hiện tại** của CallSite đó.

Ba thành phần:

```text
CallSite
├── type()          → MethodType cố định
├── getTarget()     → target hiện tại
└── dynamicInvoker()→ MethodHandle gọi xuyên qua CallSite
```

Ví dụ:

```java
MethodHandle target =
        MethodHandles.constant(
                String.class,
                "v1"
        );

CallSite site =
        new ConstantCallSite(target);

MethodHandle invoker =
        site.dynamicInvoker();
```

Điểm quan trọng: CallSite không tự “tìm method”. Nó là abstraction **giữ target** sau khi bootstrap hoặc runtime policy đã quyết định target nào phù hợp.
