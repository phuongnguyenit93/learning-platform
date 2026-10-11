Tạo một giá trị lambda không đồng nghĩa với việc thân lambda chạy ngay.

```java
Supplier<String> message = () -> {
    System.out.println("building message");
    return "ready";
};
```

Sau dòng trên, hành vi đã được tạo nhưng chuỗi `building message` chưa được in. Thân lambda chỉ chạy khi phương thức hàm được gọi:

```java
String value = message.get();
```

Điểm khác biệt này rất quan trọng với công việc trì hoãn. Lambda có thể giữ lại cấu hình ở thời điểm tạo, rồi được một phương thức hoặc thành phần khác gọi ở thời điểm sau.

Không nên suy luận rằng "truyền lambda vào" đồng nghĩa với "lambda chạy ngay". Thời điểm thực thi do API nhận giá trị giao diện hàm quyết định.
