Mental model:

```text
Caller
  ↓
Spring AOP Proxy
  ↓
Advice chain
  ↓
Target Object
```

When a bean needs AOP, Spring usually gives consumers a proxy instead of a direct reference to the target object.

The proxy can be created using different strategies such as JDK dynamic proxy or class-based proxy. Do not hard-code the assumption that every bean always uses the same proxy type.

More important than the proxy type is this question:

```text
does the invocation pass through the proxy?
```
