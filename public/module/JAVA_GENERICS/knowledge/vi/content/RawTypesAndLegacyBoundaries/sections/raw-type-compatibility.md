Với một khai báo generic:

```java
class Box<T> {
    private T value;
    void set(T value) { this.value = value; }
    T get() { return value; }
}
```

`Box` không có type argument là raw type:

```java
Box raw = new Box();
```

Trong mã mới, nên dùng:

```java
Box<String> typed = new Box<>();
Box<?> unknown = typed;
```

`Box<?>` và raw `Box` không tương đương. Wildcard nói “có một type argument cụ thể nhưng tôi không biết nó”; raw type làm suy yếu một phần kiểm tra generic để tương thích với mã cũ.
