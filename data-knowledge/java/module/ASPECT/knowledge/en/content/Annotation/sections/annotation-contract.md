The module defines:

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface TrackExecution {
    String value();
}
```

`RUNTIME` is required because the Aspect reads metadata while the application is running.

`METHOD` indicates that the annotation is intended only for methods.

A method can declare:

```java
@TrackExecution("annotation-demo")
public String executeTrackedOperation() {
    ...
}
```

The business method only declares **which behavior it wants**; the timing/tracking implementation stays in the Aspect.
