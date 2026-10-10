Sao chép sâu cố gắng tạo trạng thái độc lập cho những phần có thể thay đổi và cần tách quan hệ sở hữu. Trong ví dụ trên, hàm khởi tạo sao chép có thể dùng `new ArrayList<>(source.tags)` để tài khoản mới sở hữu một danh sách riêng.

Không có một thuật toán sao chép sâu chung cho mọi lớp. Ta phải quyết định:

- đối tượng con nào cần sao chép;
- đối tượng bất biến nào có thể dùng chung;
- chu trình tham chiếu và danh tính được xử lý thế nào.

Sao chép sâu vì vậy là quyết định về mô hình dữ liệu và quan hệ sở hữu, không chỉ là gọi `clone()` đệ quy một cách máy móc.
