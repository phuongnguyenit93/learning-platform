An anonymous class creates a new object scope. Inside its instance methods, `this` refers to the anonymous-class instance. A lambda does not create that kind of scope.

```java
class Demo {
    void showDifference() {
        Runnable anonymous = new Runnable() {
            @Override
            public void run() {
                System.out.println(this.getClass().getName());
            }
        };

        Runnable lambda = () ->
                System.out.println(this.getClass().getName());
    }
}
```

In the anonymous class, `this` is the anonymous `Runnable` object. In the lambda, `this` is the enclosing `Demo` instance.

This is one reason replacing an anonymous class with a lambda is not always a purely textual shortening. Code that relies on anonymous-class identity, its own `this`, or extra members may need a real class or anonymous class instead.
