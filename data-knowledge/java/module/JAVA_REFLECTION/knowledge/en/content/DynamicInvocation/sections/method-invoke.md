Once a Method has been selected, invoke(receiver, args...) performs the call:

~~~java
PaymentService service = new PaymentService("stripe");
PaymentRequest request = new PaymentRequest("ORD-1", 100_000);

Method method = PaymentService.class.getMethod(
        "pay",
        PaymentRequest.class
);

Object result = method.invoke(service, request);
String paymentId = (String) result;
~~~

Method.invoke returns Object. Primitive return values are boxed; a void method produces null.

For an instance method, the receiver must be compatible with the declaring class. A static method ignores the receiver, and null is the clearest value to pass:

~~~java
Method parse = Long.class.getMethod("parseLong", String.class);
Object value = parse.invoke(null, "100");
~~~

Invocation can perform the unboxing and primitive-widening conversions allowed by the Reflection contract, but it does not redo Java's full compile-time overload selection. Once the descriptor represents a method that accepts long, a compatible boxed primitive may be unboxed/widened; a String such as "100" is not automatically converted to long.

A wrong receiver, wrong argument count, or incompatible argument can produce IllegalArgumentException. A method that is not reflectively accessible from the caller can produce IllegalAccessException. Changing reflective accessibility belongs to Access Control.

Framework code commonly benefits from separating discovery from invocation:

~~~java
Method payMethod = resolvePaymentMethod(PaymentService.class);

// validate/cache once during setup

Object result = payMethod.invoke(service, request);
~~~

That moves configuration errors toward bootstrap time and avoids repeated string-based lookup on every business operation.
