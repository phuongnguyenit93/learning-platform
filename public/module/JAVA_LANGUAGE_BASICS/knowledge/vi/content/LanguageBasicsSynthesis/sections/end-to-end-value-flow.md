Hãy lấy một giá trị và theo dõi nó qua các bước: được viết dưới dạng literal hoặc sinh ra từ biểu thức, được gán vào biến, có thể được chuyển đổi/đóng hộp, được đặt vào mảng, truyền vào phương thức bằng pass-by-value, rồi ảnh hưởng đến trạng thái hoặc nhánh luồng điều khiển.

Ví dụ cụ thể:

```java
static void addBonus(int[] scores, int bonus) {
    if (scores.length > 0) {
        scores[0] = scores[0] + bonus;
    }
}

int base = 10;                 // literal 10 → biến base kiểu int
int bonus = base + 5;          // biểu thức tạo giá trị int 15
int[] scores = {base};         // giá trị 10 được đặt vào phần tử mảng
addBonus(scores, bonus);       // sao chép giá trị tham chiếu của scores và giá trị int 15
boolean passed = scores[0] > 20; // thay đổi thấy được ở bên gọi → biểu thức boolean → có thể điều khiển nhánh
```

Theo dõi chuỗi này:

```text
literal 10
→ base = 10
→ base + 5 tạo bonus = 15
→ scores[0] ban đầu = 10
→ lời gọi sao chép tham chiếu của scores + giá trị 15 vào tham số
→ phương thức thay đổi đối tượng mảng: scores[0] thành 25
→ bên gọi vẫn trỏ cùng mảng nên quan sát 25
→ scores[0] > 20 tạo boolean true
→ boolean đó có thể quyết định nhánh luồng điều khiển tiếp theo
```

Ví dụ này nối trực tiếp khai báo, biểu thức, thay đổi mảng, truyền dữ liệu qua phương thức, pass-by-value và kết quả điều khiển luồng trong một đường đi duy nhất.

Với giá trị tham chiếu, luôn tách hai câu hỏi:

1. biến đang giữ **giá trị tham chiếu nào**;
2. đối tượng được tham chiếu có **trạng thái nào**.

Sự tách biệt này giải thích phép gán, aliasing, thay đổi trạng thái, `null`, tính hiệp biến của mảng, ép kiểu và nhiều hành vi lúc chạy mà người mới thường nhầm lẫn.
