Đối tượng có `final List<Address> addresses` chưa chắc bất biến sâu nếu `Address` hoặc danh sách phía sau vẫn có thể thay đổi. `final` cố định tham chiếu của trường; nó không tự động “đóng băng” toàn bộ trạng thái có thể truy cập phía sau.

```text
bất biến nông
→ trạng thái có thể quan sát trực tiếp của đối tượng bên ngoài không thay đổi
→ nhưng các đối tượng con mà nó tham chiếu tới vẫn có thể thay đổi

bất biến sâu
→ tính bất biến được duy trì xuyên qua toàn bộ trạng thái có thể truy cập cần được bảo vệ
```

Không phải miền nghiệp vụ nào cũng cần bất biến sâu, nhưng quan hệ sở hữu phải rõ để bên gọi biết dữ liệu có thể thay đổi từ đâu.

Chương tiếp theo gom toàn bộ các mảnh đã học thành một mô hình xuyên suốt và chỉ rõ phần kiến thức nào được chuyển tiếp sang OOP, Quy ước của Object, Reflection và ClassLoader.
