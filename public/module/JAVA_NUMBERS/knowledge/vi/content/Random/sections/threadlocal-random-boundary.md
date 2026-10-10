`ThreadLocalRandom` được thiết kế cho mã chạy đồng thời để giảm tranh chấp tài nguyên (contention) khi nhiều luồng cần giá trị giả ngẫu nhiên.

```java
int value =
        ThreadLocalRandom.current()
                .nextInt(10, 20);
```

Nó phù hợp cho:

- mô phỏng;
- lập lịch có yếu tố ngẫu nhiên;
- lấy mẫu;
- heuristic cân bằng tải không có yêu cầu bảo mật.

`ThreadLocalRandom` không có nghĩa “mọi mã chạy trên luồng nên dùng nó”. Câu hỏi đúng là:

```text
trường hợp sử dụng có tranh chấp khi chạy đồng thời không?
và
tính ngẫu nhiên có cần khó dự đoán để phục vụ bảo mật không?
```

Dự án dùng Java 21 làm phiên bản nền, vì vậy API sinh số ngẫu nhiên hiện đại `java.util.random.RandomGenerator` và nhiều cách triển khai bộ sinh đã sẵn có. Ở mô-đun Numbers, chỉ cần hiểu rằng **lựa chọn thuật toán, khả năng tái lập kết quả và mô hình chạy đồng thời là những mối quan tâm riêng biệt**; chi tiết chọn từng thuật toán thuộc mức sâu hơn.

`Math.random()` cũng chỉ là tiện ích giả ngẫu nhiên cho trường hợp sử dụng thông thường; nó không làm cho nguồn ngẫu nhiên trở nên an toàn về mặt mật mã.
