Một **lớp bọc (wrapper)** nhận một stream, reader hoặc writer khác làm lớp bên dưới, bổ sung một khả năng rồi chuyển tiếp việc đọc/ghi xuống lớp đó. Nhờ vậy Java không cần tạo một lớp riêng cho mọi tổ hợp như “đọc tệp + giải mã UTF-8 + đọc theo dòng + có bộ đệm”.

```text
nguồn byte
    ↓ FileInputStream
    ↓ InputStreamReader   — chuyển byte thành ký tự
    ↓ BufferedReader      — thêm bộ đệm + readLine()
ứng dụng
```

Không phải lớp bọc nào cũng dùng để đệm dữ liệu. `DataInputStream` bổ sung cách đọc các giá trị nguyên thủy có cấu trúc; `InputStreamReader` bổ sung bước giải mã charset; `BufferedInputStream` hoặc `BufferedReader` mới bổ sung bộ đệm. Khi đọc một chuỗi lớp bọc, hãy hỏi **mỗi lớp thêm hành vi gì**, **`close()` được lan truyền xuống chuỗi như thế nào**, và tách riêng câu hỏi **phạm vi ứng dụng nào thật sự sở hữu trách nhiệm đóng tài nguyên bên dưới**.
