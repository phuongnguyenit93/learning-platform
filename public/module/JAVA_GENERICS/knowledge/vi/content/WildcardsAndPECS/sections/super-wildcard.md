```java
static void addDefaults(List<? super Integer> target) {
    target.add(1);
    target.add(2);
}
```

Phương thức có thể nhận `List<Integer>`, `List<Number>` hoặc `List<Object>`.

Ta được phép ghi `Integer` vì mọi khả năng trên đều có thể chứa `Integer`.

Khi đọc:

```java
Object value = target.get(0);
```

Ta chỉ biết chắc `Object`, vì list thật có thể là `List<Object>`.

### Từ Wildcard đến PECS

Sau khi biết `? extends T` và `? super T`, vấn đề thực tế thường không còn là cú pháp mà là:

```text
"Lúc nào dùng extends?
Lúc nào dùng super?
Tại sao?"
```

Hãy nhìn một thao tác copy:

```java
static <T> void copy(
        List<? extends T> source,
        List<? super T> target) {
    for (T value : source) {
        target.add(value);
    }
}
```

`source` là nguồn mà phương thức **đọc `T` ra**. `target` là đích mà phương thức **ghi `T` vào**.

**PECS — Producer Extends, Consumer Super** — chỉ là một cách nhớ hướng đó:

```text
nguồn CUNG CẤP (Producer) dữ liệu cho mình đọc → ? extends T
đích TIẾP NHẬN (Consumer) dữ liệu mình ghi vào → ? super T
```

PECS không phải một tính năng mới của Java; nó là **quy tắc gợi nhớ** giúp đọc và thiết kế chữ ký wildcard đúng hơn.
