Độ ưu tiên quyết định biểu thức được **nhóm** như thế nào; thứ tự đánh giá quyết định toán hạng nào được tính trước.

Java xác định thứ tự đánh giá toán hạng từ trái sang phải trong nhiều ngữ cảnh biểu thức, nhưng tác dụng phụ bên trong biểu thức dài vẫn làm mã khó đọc:

```java
array[i++] = i + update();
```

Nếu phải nhớ bảng độ ưu tiên phức tạp mới hiểu được ý định, hãy dùng dấu ngoặc hoặc tách biểu thức thành các câu lệnh nhỏ hơn.

### Độ ưu tiên không phải tính kết hợp

Độ ưu tiên trả lời toán tử nào nhóm chặt hơn. Tính kết hợp giải quyết cách nhóm khi các toán tử có cùng độ ưu tiên. Thứ tự đánh giá lại trả lời toán hạng nào được tính trước.

```java
int result = 2 + 3 * 4; // 14 vì * có độ ưu tiên cao hơn +
int left = 20 / 5 / 2;  // (20 / 5) / 2 = 2 do kết hợp từ trái sang phải
```

### `++`/`--`: prefix và postfix

```java
int i = 1;
int a = i++; // a = 1, i = 2
int b = ++i; // i = 3, b = 3
```

Các biểu thức ghép nhiều phép tăng/giảm có thể đúng theo đặc tả nhưng khó kiểm tra. Ưu tiên câu lệnh riêng khi giá trị trung gian có ý nghĩa.

### So sánh bằng trên giá trị nguyên thủy và tham chiếu

Với giá trị nguyên thủy, `==` so sánh giá trị sau chuyển đổi phù hợp. Với tham chiếu, `==` so sánh tính đồng nhất của tham chiếu, không thay thế `equals` khi bài toán cần so sánh giá trị theo ngữ nghĩa.

Chương tiếp theo đi từ chuyển đổi ngầm trong biểu thức sang chuyển đổi có chủ ý bằng ép kiểu (casting).
