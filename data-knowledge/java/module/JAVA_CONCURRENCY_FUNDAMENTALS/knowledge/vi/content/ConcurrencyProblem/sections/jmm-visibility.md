Visibility trả lời câu hỏi:

> Nếu Thread A đã ghi một giá trị, dựa vào guarantee nào để Thread B chắc chắn nhìn thấy giá trị đó?

Không nên giải thích Java Memory Model bằng mental model đơn giản kiểu:

```text
Thread A ghi RAM
Thread B đọc RAM
```

Java không yêu cầu programmer suy luận trực tiếp từ L1/L2/L3 cache hay register của CPU.

Thứ programmer cần dựa vào là **Java Memory Model (JMM)**.

JMM định nghĩa những điều JVM phải đảm bảo về:

- visibility;
- ordering;
- synchronization actions;
- happens-before relationship.

Nếu giữa hai action không tồn tại một synchronization guarantee phù hợp, việc một Thread "đã ghi rồi" theo thời gian thực không tự động đảm bảo Thread khác phải quan sát giá trị mới theo cách chương trình mong muốn.

### Stale data

Stale data là trường hợp một Thread tiếp tục quan sát state cũ trong khi một Thread khác đã cập nhật state.

Điểm quan trọng:

```text
không thấy stale data trong một lần chạy
≠
code đã thread-safe
```

Một bug visibility có thể phụ thuộc JVM optimization, architecture, timing và cách chương trình được compile/run.

Vì vậy không nên thiết kế bài học dựa trên mục tiêu:

> "Chạy cho đến khi stale data xuất hiện thì mới chứng minh được JMM."

Điều cần học là **guarantee**, không phải săn một hiện tượng ngẫu nhiên.
