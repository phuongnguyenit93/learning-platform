Experiment dùng cùng:

```text
GreetingTarget
TracingMethodInterceptor
```

nhưng tạo hai proxy.

JDK proxy:

```java
factory.setInterfaces(GreetingOperations.class);
factory.setProxyTargetClass(false);
```

Caller tương tác qua interface `GreetingOperations`.

JDK proxy expose interface surface chứ không trở thành subclass của `GreetingTarget`. Vì vậy trong response:

```text
proxyIsGreetingOperations = true
proxyIsGreetingTarget     = false
targetOnlyCapabilityVisibleThroughProxyType = false
```

Fact `targetOnlyCapabilityVisibleThroughProxyType` được tính bằng cách inspect public methods trên **runtime proxy class**, không phải boolean hard-code.

CGLIB proxy:

```java
factory.setProxyTargetClass(true);
```

Proxy là subclass của `GreetingTarget`.

Vì thế concrete type surface vẫn nhìn thấy:

```text
proxyIsGreetingOperations = true
proxyIsGreetingTarget     = true
targetOnlyCapabilityVisibleThroughProxyType = true
```

Experiment còn gọi trực tiếp:

```java
cglibProxy.targetOnlyCapability()
```

để chứng minh một method chỉ tồn tại trên concrete target class vẫn nằm trên type surface của class-based proxy.

Điểm cần hiểu không phải proxy nào "tốt hơn" tuyệt đối. Strategy quyết định type surface và một số limitation của interception.

Điều này nối trực tiếp lại `this(...)` và `target(...)` ở chapter Pointcut. Với JDK proxy trong experiment:

```text
proxy object
→ implements GreetingOperations
→ không phải GreetingTarget

target object phía sau proxy
→ GreetingTarget
```

Vì vậy `this(...)` nhìn type surface của proxy, còn `target(...)` nhìn target type. Đây là lý do hai designator có thể cho kết quả khác nhau khi proxy strategy thay đổi.
