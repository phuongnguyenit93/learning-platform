A Method descriptor contains much more than its name:

~~~java
Method method = PaymentService.class.getMethod(
        "pay",
        PaymentRequest.class
);

String name = method.getName();
Class<?> declaringClass = method.getDeclaringClass();
Class<?> returnType = method.getReturnType();
Class<?>[] parameterTypes = method.getParameterTypes();
Class<?>[] exceptionTypes = method.getExceptionTypes();
int modifiers = method.getModifiers();
~~~

`getDeclaringClass()` returns the class or interface that **actually declares that method descriptor**. This can differ from the class where lookup started: `PaymentService.class.getMethod(...)` may return a public method inherited from a superclass or interface, in which case the declaring class is not necessarily `PaymentService`.

A framework can validate a contract before invoking:

~~~java
if (method.getReturnType() != String.class) {
    throw new IllegalStateException("pay must return String");
}

if (!Modifier.isPublic(method.getModifiers())) {
    throw new IllegalStateException("pay must be public");
}
~~~

Generic signatures have parallel APIs:

~~~java
method.getGenericReturnType();
method.getGenericParameterTypes();
method.getGenericExceptionTypes();
~~~

These methods return `Type` metadata instead of only `Class<?>` and are covered more deeply in **Generic Signature Metadata after Erasure**.

Parameter metadata is available through:

~~~java
for (Parameter parameter : method.getParameters()) {
    System.out.println(parameter.getName());
    System.out.println(parameter.getType());
}
~~~

Source-level parameter names are **not always retained by default**. Without build metadata such as the -parameters compiler option, Reflection may expose generated names such as arg0. A framework should not depend on parameter names unless its build/deployment contract guarantees their presence.

Method also exposes useful flags:

~~~java
method.isVarArgs();
method.isDefault();
method.isBridge();
method.isSynthetic();
~~~

isDefault() identifies an interface default method. isBridge()/isSynthetic() warn that a method may be a compiler-generated artifact rather than a source declaration the application author explicitly wrote.

After Field and Method discovery, the remaining member kind is **Constructor**: which constructors exist, what parameter/exception/modifier metadata describes them, and which descriptor should a framework choose before object creation?
