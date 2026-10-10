`@Deprecated` đánh dấu phần tử chương trình mà lập trình viên được khuyến nghị **không tiếp tục sử dụng**.

```java
@Deprecated(since = "2.0", forRemoval = true)
public void oldCheckout() {
}
```

Từ Java 9, Annotation có hai phần tử quan trọng:

- `since`: phiên bản mà API bị deprecate;
- `forRemoval`: cho biết API được dự kiến loại bỏ trong tương lai hay không.

Khi mã nguồn sử dụng API đã deprecated, trình biên dịch/công cụ có thể phát cảnh báo. Tuy nhiên deprecation **không tự xóa API** và cũng không đảm bảo API sẽ biến mất ở một phiên bản cụ thể.

### `@Deprecated` và Javadoc `@deprecated`

Hai cơ chế bổ sung cho nhau:

```java
/**
 * @deprecated Use {@link #newCheckout()} instead.
 */
@Deprecated(since = "2.0")
public void oldCheckout() {
}
```

`@Deprecated` là Annotation có cấu trúc để công cụ có thể đọc. Javadoc tag giải thích hướng chuyển đổi cho con người. API public nên thường có cả hai khi cần tài liệu chuyển đổi rõ ràng.
