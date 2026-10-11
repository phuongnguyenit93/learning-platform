Trình biên dịch xét các phương thức nạp chồng theo những giai đoạn ưu tiên. Một mô hình tư duy hữu ích:

```text
1. số lượng tham số cố định, chưa cần boxing/varargs
        ↓ nếu chưa có ứng viên phù hợp
2. cho phép boxing/unboxing phù hợp
        ↓ nếu vẫn chưa có
3. dùng varargs như phương án cuối
```

Đặc tả chi tiết hơn mô hình này, nhưng thứ tự trên giải thích được nhiều câu hỏi kiểu “mở rộng kiểu, boxing hay varargs được ưu tiên?”.

Ví dụ kinh điển:

```java
void pick(long x) { System.out.println("long"); }
void pick(Integer x) { System.out.println("Integer"); }
void pick(int... x) { System.out.println("varargs"); }

pick(1); // long
```

`int -> long` được giải quyết ở giai đoạn số lượng tham số cố định mà chưa cần boxing, nên được chọn trước boxing và varargs.
