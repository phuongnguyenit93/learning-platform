`?` và `<T>` đều giúp API tránh khóa cứng vào một kiểu cụ thể, nhưng chúng giải quyết **hai nhu cầu khác nhau**.

Khi API chỉ cần nói “đây là một giá trị thuộc một họ kiểu nào đó” và không cần nhắc lại chính kiểu đó ở vị trí khác, wildcard thường đủ:

```java
static int sizeOf(List<?> values) {
    return values.size();
}
```

Khi nhiều vị trí phải cùng nói về **một kiểu duy nhất**, tham số kiểu có tên giúp giữ quan hệ đó:

```java
static <T> T first(List<T> values) {
    return values.get(0);
}

static <T> void copyOne(T value, List<? super T> target) {
    target.add(value);
}
```

Mô hình tư duy:

```text
?
→ một type argument chưa biết ở nơi sử dụng
→ không cần đặt tên để dùng lại ở vị trí khác

<T>
→ một type variable có tên
→ dùng khi API cần giữ cùng một danh tính kiểu qua nhiều vị trí
```

Đây không phải quy tắc “wildcard chỉ để đọc, `<T>` chỉ để ghi”. Câu hỏi đúng là: **API có cần giữ và tái sử dụng cùng một quan hệ kiểu ở nhiều vị trí hay không?**
