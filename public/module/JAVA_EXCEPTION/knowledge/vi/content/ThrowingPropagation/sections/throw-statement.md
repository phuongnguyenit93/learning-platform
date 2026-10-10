`throw` là câu lệnh làm luồng điều khiển rời khỏi đường chạy hiện tại.

```java
if (amount < 0) {
    throw new IllegalArgumentException("amount must be >= 0");
}
```

Sau khi `throw` thực thi:

1. câu lệnh kế tiếp trong khối lệnh hiện tại không chạy;
2. Java tìm `catch` phù hợp quanh vị trí hiện tại;
3. nếu không có, phương thức hiện tại bị rời bỏ;
4. exception tiếp tục lan truyền lên mã gọi.

### `throw` không bắt buộc phải tạo đối tượng mới

Thông thường, biểu thức sau `throw` phải có kiểu tương thích với `Throwable`.

Trường hợp biên của ngôn ngữ là `throw null;`: câu lệnh này vẫn hợp lệ khi biên dịch, nhưng khi chạy Java sẽ phát sinh `NullPointerException` tại chính câu lệnh `throw`.

Có thể tạo mới:

```java
throw new IOException("cannot read");
```

hoặc ném lại đối tượng đã có:

```java
catch (IOException ex) {
    audit(ex);
    throw ex;
}
```

Vì vậy phát biểu chính xác là:

```text
throw <Throwable expression>
```

chứ không phải “sau throw luôn phải là new Exception(...)”.

### Throw và đường chạy bình thường

```java
void validate(int quantity) {
    if (quantity < 0) {
        throw new IllegalArgumentException("quantity < 0");
    }

    save(quantity);
}
```

Nếu `quantity < 0`, `save(quantity)` không được gọi. Exception ở đây vừa mang thông tin lỗi vừa làm luồng điều khiển rời khỏi đường thành công.
