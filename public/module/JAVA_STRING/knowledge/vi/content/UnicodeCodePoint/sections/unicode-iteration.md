Khi logic thực sự cần xử lý điểm mã Unicode, dùng các API nhận biết code point:

```java
text.codePoints().forEach(System.out::println);
```

Trong mã thật, phần xử lý có thể thay `System.out::println` bằng logic nghiệp vụ làm việc với từng điểm mã.

hoặc `codePointAt` kết hợp `Character.charCount(cp)` để tăng chỉ số đúng số đơn vị mã.

Ví dụ duyệt bằng chỉ số:

```java
for (int i = 0; i < text.length(); ) {
    int cp = text.codePointAt(i);
    // xử lý cp
    i += Character.charCount(cp);
}
```

Khi cần di chuyển N điểm mã từ một vị trí, dùng `offsetByCodePoints` thay vì tự cộng chỉ số.

Không cần chuyển mọi vòng lặp String sang mức điểm mã. Hãy chọn tầng biểu diễn phù hợp với câu hỏi đang giải quyết.
