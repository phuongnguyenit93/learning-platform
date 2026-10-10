Creating a lambda value does not automatically run its body.

```java
Supplier<String> message = () -> {
    System.out.println("building message");
    return "ready";
};
```

At this point the behavior has been created, but `building message` has not been printed. The body runs when the functional method is invoked:

```java
String value = message.get();
```

This distinction matters for deferred work. A lambda can capture configuration now and be executed later by another method or component.

Do not assume that "passing a lambda" means the lambda runs immediately. Execution timing is controlled by the API that receives and invokes the functional-interface value.
