An important distinction is whether a failure happens **before the target method body runs** or **inside the target method itself**.

Suppose pay(...) rejects an invalid amount:

~~~java
public String pay(PaymentRequest request) throws PaymentException {
    if (request.amount() <= 0) {
        throw new PaymentException("amount must be positive");
    }
    processedCount++;
    return provider + ":" + request.orderId();
}
~~~

A direct call:

~~~java
service.pay(request);
~~~

throws PaymentException according to the method's normal contract.

A reflective call exposes target failure through InvocationTargetException:

~~~java
try {
    method.invoke(service, request);
} catch (InvocationTargetException ex) {
    Throwable targetFailure = ex.getCause();
}
~~~

The wrapper marks a useful boundary:

~~~text
NoSuchMethodException
→ discovery failed

IllegalAccessException
→ reflective access was denied

IllegalArgumentException
→ receiver/arguments did not satisfy the invocation contract

InvocationTargetException
→ the target method was invoked and target code threw
~~~

Frameworks normally inspect or unwrap getCause() and translate it according to their own policy. Logging only the wrapper can hide the business exception that actually explains the failure.
