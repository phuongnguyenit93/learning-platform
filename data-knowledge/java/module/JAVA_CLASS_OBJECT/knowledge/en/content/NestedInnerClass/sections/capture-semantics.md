Local/anonymous classes may capture local variables only when those variables are `final` or effectively final.

```java
int limit = 10;
Runnable r = new Runnable() {
    public void run() {
        System.out.println(limit);
    }
};
```

The local variable is **captured by value**. If that value is a reference, the captured reference still points to the same object; Java does not deep-copy that object and does not expose a reassignable local-variable slot to the local/anonymous class.

The next chapter looks at the root class shared by ordinary class instances: `java.lang.Object`.
