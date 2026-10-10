Kế thừa làm phép bằng nhau khó thiết kế hơn khi lớp con thêm trạng thái mới có ý nghĩa đối với phép so sánh.

Giả sử lớp cha chỉ xét `x`, còn lớp con muốn xét thêm `color`:

> Ví dụ dưới đây cố ý chỉ tập trung vào lỗi đối xứng của `equals`. Trong một lớp hoàn chỉnh, mỗi lớp ghi đè `equals` vẫn phải triển khai `hashCode` nhất quán với phép bằng nhau của chính nó.

```java
class Point {
    final int x;

    Point(int x) {
        this.x = x;
    }

    @Override
    public boolean equals(Object other) {
        return other instanceof Point p && x == p.x;
    }
}

class ColoredPoint extends Point {
    final String color;

    ColoredPoint(int x, String color) {
        super(x);
        this.color = color;
    }

    @Override
    public boolean equals(Object other) {
        return other instanceof ColoredPoint p
                && x == p.x
                && Objects.equals(color, p.color);
    }
}
```

Khi đó có thể xảy ra:

```text
new Point(1).equals(new ColoredPoint(1, "red"))
→ true

new ColoredPoint(1, "red").equals(new Point(1))
→ false
```

Tính đối xứng bị phá vỡ.

### BÀI HỌC THIẾT KẾ

Với ngữ nghĩa giá trị phức tạp, hãy cân nhắc:

- kết hợp đối tượng (composition) thay vì mở kế thừa tùy ý;
- lớp giá trị `final`;
- hệ phân cấp `sealed`/đóng với chính sách bằng nhau rõ ràng;
- phép bằng nhau dựa trên lớp nếu nghiệp vụ yêu cầu đúng chính xác lớp thực tế tại thời điểm chạy.

Mục tiêu không phải chọn một mẫu `equals` duy nhất, mà thiết kế một **quan hệ bằng nhau nhất quán**.

### CHUYỂN TIẾP

`equals` đã trả lời “hai đối tượng có cùng giá trị logic không?”. Cấu trúc dữ liệu dựa trên mã băm còn cần một tín hiệu có chi phí thấp hơn để **thu hẹp tập ứng viên trước khi gọi `equals`**. Đó là vai trò của `hashCode`.
