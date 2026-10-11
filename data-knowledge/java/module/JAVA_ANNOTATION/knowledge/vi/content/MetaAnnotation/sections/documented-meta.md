`@Documented` nói rằng việc sử dụng Annotation nên được xem là một phần của quy tắc API public khi công cụ tài liệu tạo tài liệu:

```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface StableApi {
}
```

Nếu một type public được gắn `@StableApi`, tài liệu API được sinh ra có thể trình bày Annotation đó như một phần của quy tắc.

`@Documented` **không**:

- làm Annotation có chính sách `RUNTIME`;
- làm Annotation được kế thừa;
- làm framework tự đọc Annotation.

Nó giải quyết khía cạnh tài liệu, không phải vòng đời hay tra cứu.
