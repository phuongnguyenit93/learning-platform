`InvocationHandler` has one central method:

```java
Object invoke(Object proxy, Method method, Object[] args) throws Throwable;
```

`method` describes the operation the caller invoked, `args` contains its arguments, and `proxy` is the proxy instance itself. For a zero-argument method, the JDK may pass `args == null`, so a generic handler must not assume that `args.length` is always available. The handler can log, check permissions, measure time, route to a remote endpoint, or delegate to a real object.

A small handler for the payment example is:

```java
final class LoggingHandler implements InvocationHandler {
    private final PaymentGateway target;

    LoggingHandler(PaymentGateway target) {
        this.target = target;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        if (method.getDeclaringClass() == Object.class) {
            return handleObjectMethod(proxy, method, args);
        }

        System.out.println("before " + method.getName());

        try {
            Object result = method.invoke(target, args);
            System.out.println("after " + method.getName());
            return result;
        } catch (InvocationTargetException ex) {
            throw ex.getCause();
        }
    }

    private Object handleObjectMethod(Object proxy, Method method, Object[] args) {
        return switch (method.getName()) {
            case "toString" -> "PaymentGatewayProxy[" + target + "]";
            case "hashCode" -> System.identityHashCode(proxy);
            case "equals" -> proxy == args[0];
            default -> throw new UnsupportedOperationException(method.toString());
        };
    }
}
```

Unwrapping `InvocationTargetException` is significant when delegating with `Method.invoke()`. If `pay()` throws a business exception, a handler usually wants to propagate the underlying cause according to the interface contract instead of exposing the reflective wrapper as the primary failure.

Exceptions leaving the handler must also fit the method contract implemented by the proxy. Runtime exceptions and errors can pass through directly; a checked exception should be assignable to a type declared by the corresponding interface method. If the handler throws an undeclared checked exception, the proxy caller can receive an `UndeclaredThrowableException` wrapping it.

A handler does not have to delegate to a local object. An HTTP/RPC client proxy can inspect the `Method` and its annotations, encode a network request, and decode the response. The central idea is that a proxy converts a **typed interface call** into a **runtime interception event**.
