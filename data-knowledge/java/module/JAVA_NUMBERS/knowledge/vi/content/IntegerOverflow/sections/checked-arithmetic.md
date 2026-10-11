Khi tràn số phải được coi là **vi phạm yêu cầu của bài toán**, phép toán có kiểm tra giúp biến tràn số thành lỗi rõ ràng thay vì để giá trị âm thầm quay vòng.

Ví dụ:

```java
try {
    int next = Math.addExact(Integer.MAX_VALUE, 1);
} catch (ArithmeticException ex) {
    System.out.println("overflow detected");
}
```

Danh sách đầy đủ các phương thức `*Exact` và cách dùng API chi tiết thuộc chương `Math` phía sau. Ở đây cần giữ mô hình quyết định:

```text
phép toán thông thường
→ tràn số có thể làm giá trị quay vòng

phương thức `*Exact`
→ tràn số được biến thành ArithmeticException
```

Không phải mọi phép toán đều cần phương thức kiểm tra. Nếu việc quay vòng là chủ ý của thuật toán mức thấp thì phép toán có kiểm tra có thể không phù hợp. Nhưng với các bài toán số lượng/tiền/bộ đếm, tràn số âm thầm thường là lỗi.

Với Java 21 là phiên bản nền của dự án, `absExact` và `divideExact` đặc biệt hữu ích cho hai trường hợp biên ở phần sau: `MIN_VALUE` không có giá trị dương tương ứng trong cùng kiểu nguyên thủy, và `MIN_VALUE / -1` bị tràn.
