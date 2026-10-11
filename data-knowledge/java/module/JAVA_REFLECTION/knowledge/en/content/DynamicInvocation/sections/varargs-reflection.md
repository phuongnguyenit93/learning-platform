Varargs can be confusing because there are **two varargs layers**: the target method may be variable-arity, and Method.invoke(...) itself accepts Object... args.

Consider an additional method used only for this example:

~~~java
public String summarize(String prefix, String... values) {
    return prefix + ":" + String.join(",", values);
}
~~~

Reflection represents the final target parameter as an array:

~~~java
Method method = PaymentService.class.getMethod(
        "summarize",
        String.class,
        String[].class
);

System.out.println(method.isVarArgs()); // true
~~~

The invocation must supply the array as the final reflective argument:

~~~java
Object result = method.invoke(
        service,
        "payments",
        new String[] {"A", "B"}
);
~~~

Reflection does not automatically perform target-level varargs packing in the same way as an ordinary Java call expression. If the target has only one String... parameter:

~~~java
public String join(String... values) { ... }
~~~

make it explicit that String[] is **one reflective argument**:

~~~java
Method join = PaymentService.class.getMethod(
        "join",
        String[].class
);

join.invoke(service, (Object) new String[] {"A", "B"});
~~~

The Object cast prevents the Java compiler from treating String[] as the Object... array belonging to Method.invoke itself and spreading it at the outer call site.

Utilities that invoke methods reflectively should inspect isVarArgs() and normalize arguments according to their own documented rules instead of assuming Method.invoke will reproduce every source-level varargs convenience.

After method invocation, the remaining operation in the basic object lifecycle is construction: **if the concrete class is selected at runtime, how is the original object created?**
