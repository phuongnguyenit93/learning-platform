Phong cách hàm phù hợp khi bài toán có thể biểu diễn rõ bằng các giá trị hành vi nhỏ, phép biến đổi, điều kiện hoặc chính sách có thể ghép với nhau.

Cách viết mệnh lệnh có thể rõ hơn khi câu chuyện chính là một chuỗi thay đổi trạng thái: bộ đếm thử lại, vòng đời tài nguyên, máy trạng thái, nhiều nhánh thoát sớm hoặc quy trình mà mỗi bước phụ thuộc vào thay đổi của bước trước.

```java
for (Task task : tasks) {
    if (!task.ready()) {
        continue;
    }
    execute(task);
    completed++;
}
```

Không có yêu cầu nào buộc phải chuyển đoạn mã như vậy thành chuỗi lambda. Nên chọn cách thể hiện làm luồng điều khiển và các bất biến của bài toán lộ rõ nhất.
