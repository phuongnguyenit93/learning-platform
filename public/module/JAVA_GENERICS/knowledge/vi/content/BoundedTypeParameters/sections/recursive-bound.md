Đây là **phần nâng cao**. Ở lượt học đầu, chỉ cần hiểu rằng bound có thể mô tả quan hệ giữa `T` và chính khả năng generic của nó; chưa cần tự thiết kế F-bound phức tạp.

Một bound có thể tham chiếu lại chính type parameter:

```java
<T extends Comparable<T>>
```

Ý nghĩa là “`T` phải so sánh được với chính `T`”.

Ví dụ:

```java
static <T extends Comparable<T>> T max(T a, T b) {
    return a.compareTo(b) >= 0 ? a : b;
}
```

Đây thường được gọi là giới hạn đệ quy (recursive bound) hoặc kiểu F-bounded. Mục tiêu không phải tạo đệ quy lúc chạy; nó mô tả **quan hệ ràng buộc kiểu**.

Trong API thực tế có thể cần bound linh hoạt hơn như `Comparable<? super T>`, đặc biệt khi khả năng so sánh được khai báo ở một supertype. Chương Wildcard/PECS sẽ giải thích hướng `super`.
