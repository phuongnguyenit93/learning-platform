Đây là **phần nâng cao**. Nếu đang học lần đầu, điều bắt buộc là hiểu `?`, `? extends`, `? super` và PECS. Wildcard capture chủ yếu cần khi compiler không cho một thao tác dù ta biết kiểu chưa biết đó phải được giữ nhất quán.

Đôi khi compiler cần “đặt một tên tạm” cho kiểu chưa biết của wildcard.

Ví dụ API công khai:

```java
static void swapFirstTwo(List<?> values) {
    swapHelper(values);
}
```

Phương thức hỗ trợ dùng generic để capture kiểu:

```java
private static <T> void swapHelper(List<T> values) {
    T first = values.get(0);
    values.set(0, values.get(1));
    values.set(1, first);
}
```

`List<?>` không có nghĩa mọi phần tử là `Object` để có thể ghi tùy ý. Nó có một kiểu phần tử cụ thể nhưng **chưa biết**. Capture cho compiler một type variable nội bộ nhất quán để liên kết thao tác đọc/ghi đúng kiểu.

Quy tắc thiết kế hữu ích:

- dùng wildcard khi danh tính kiểu chỉ cần mô tả ở ranh giới API;
- dùng tham số kiểu có tên khi cần liên kết nhiều tham số/giá trị trả về bằng cùng một kiểu.

Wildcard + PECS đã hoàn tất phần linh hoạt ở nơi sử dụng. Chương tiếp theo chuyển sang ranh giới tương thích với mã Java cũ: **raw type**.
