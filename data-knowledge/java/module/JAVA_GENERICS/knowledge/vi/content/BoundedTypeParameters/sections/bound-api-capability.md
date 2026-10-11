Không bound:

```java
static <T> double area(T value) {
    // value.doubleValue(); // compiler không biết T có method này
    return 0;
}
```

Có bound:

```java
static <T extends Number> double asDouble(T value) {
    return value.doubleValue();
}
```

Compiler cho phép gọi những thành viên được bảo đảm bởi bound.

Mô hình tư duy:

```text
bound
→ giới hạn tập đối số kiểu hợp lệ
→ đổi lại phần triển khai nhận được một hợp đồng mạnh hơn
```

Không nên thêm bound chỉ để “cho chặt”. Bound quá cụ thể làm API khó tái sử dụng. Chỉ yêu cầu đúng khả năng mà thuật toán thực sự cần.

Bound nói về một **type variable có tên**. Trước khi chuyển sang wildcard, cần hiểu một quy tắc nền của kiểu generic: quan hệ kiểu con giữa các type argument **không tự truyền qua** kiểu generic. Chương tiếp theo giải thích tính bất biến (invariance) và vì sao `List<Dog>` không tự trở thành `List<Animal>`.
