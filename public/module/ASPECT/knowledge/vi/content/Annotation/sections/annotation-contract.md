Module định nghĩa:

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface TrackExecution {
    String value();
}
```

`RUNTIME` cần thiết vì Aspect đọc metadata khi application đang chạy.

`METHOD` thể hiện annotation này chỉ dùng trên method.

Một method có thể khai báo:

```java
@TrackExecution("annotation-demo")
public String executeTrackedOperation() {
    ...
}
```

Business method chỉ tuyên bố **muốn behavior gì**, còn implementation timing/tracking nằm trong Aspect.
