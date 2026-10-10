Không thể tạo subclass generic của `Throwable`:

```java
// class Problem<T> extends Exception {} // compile error
```

Không thể dùng type parameter làm kiểu trong `catch`:

```java
// catch (T ex) { ... }
```

Nhưng type parameter có thể xuất hiện trong `throws` khi bound phù hợp:

```java
static <E extends Exception> void run(ThrowingTask<E> task) throws E {
    task.run();
}

interface ThrowingTask<E extends Exception> {
    void run() throws E;
}
```

Điều này cho phép API truyền thông tin kiểu của checked exception qua hợp đồng lúc biên dịch mà không tạo một class exception generic.
