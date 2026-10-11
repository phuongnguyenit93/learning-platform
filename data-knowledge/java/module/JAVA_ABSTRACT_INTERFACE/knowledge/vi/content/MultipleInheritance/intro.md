# Đa kế thừa qua interface và giải quyết xung đột

Java không cho một lớp `extends` nhiều lớp cha, nhưng một lớp có thể `implements` nhiều interface. Các hợp đồng chỉ gồm phương thức abstract thường kết hợp được nếu chữ ký tương thích. Xung đột đáng chú ý xuất hiện khi nhiều interface cung cấp **phương thức `default`** cạnh tranh cho cùng một chữ ký.

Có thể đọc quá trình giải quyết theo thứ tự thay vì ghi nhớ các quy tắc rời rạc:

```text
Phía lớp có thành viên cùng chữ ký tương đương khi ghi đè (override-equivalent)?
→ phương thức `static`: không thể dùng để triển khai phương thức của đối tượng trong interface; lớp không hợp lệ nếu không thể loại bỏ xung đột
→ phương thức của đối tượng được lớp khai báo hoặc kế thừa:
→ cụ thể (concrete) và tương thích: phần triển khai từ phía lớp được dùng
→ trừu tượng (abstract): phương thức `default` của interface không tự thỏa yêu cầu này; lớp cụ thể vẫn phải triển khai
→ cụ thể nhưng không tương thích với hợp đồng interface: lớp phải cung cấp một override tương thích nếu có thể; nếu không sẽ lỗi biên dịch

Nếu phía lớp không có thành viên gây ảnh hưởng như trên, có một phương thức `default` của interface cụ thể hơn các phương thức `default` còn lại?
→ có: phương thức `default` cụ thể hơn được dùng

Nếu vẫn còn nhiều phương thức `default` độc lập cạnh tranh?
→ lớp triển khai phải override để giải quyết rõ ràng
```
