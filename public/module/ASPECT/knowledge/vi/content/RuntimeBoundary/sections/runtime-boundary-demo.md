Controller:

```text
RuntimeBoundaryController#inspectRuntimeBoundary()
```

Endpoint:

```text
GET /aop/advanced/runtime-boundary/inspect
```

Target:

```text
RuntimeBoundaryService#execute()
```

Aspect:

```text
RuntimeBoundaryAspect#around(...)
```

Response chứng minh các facts dương:

```text
Aspect tồn tại như Spring bean
Target được inject là AOP proxy
Target class thật vẫn truy xuất được phía sau proxy
```

Events:

```text
runtime-aspect:join-point-kind=method-execution
runtime-aspect:before
target:runtime-boundary
runtime-aspect:after
```

`method-execution` ở đây đến trực tiếp từ `JoinPoint#getKind()`, không phải một string mô tả hard-code từ Controller.

Endpoint không cố "chứng minh bằng reflection" rằng mọi loại AspectJ weaving trên thế giới đều vắng mặt. Boundary đó được xác định bởi chính build/runtime configuration của module.
