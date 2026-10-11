Một quy trình lựa chọn thực tế:

1. Xác định mô hình trừu tượng: `List`, `Set`, `Map` hay `Queue/Deque`.
2. Xác định ngữ nghĩa tính duy nhất/khóa và thứ tự bắt buộc.
3. Xác định các thao tác chính: truy cập ngẫu nhiên, kiểm tra thành viên, tra cứu theo phạm vi, thao tác đầu/cuối, lấy theo độ ưu tiên...
4. Xác định mô hình thay đổi dữ liệu: có thể sửa hoàn toàn, cố định kích thước/liên kết với nguồn, khung nhìn không cho sửa hay bản chụp độc lập.
5. Kiểm tra chính sách `null` và giới hạn của các phương thức tạo. Ví dụ `List.of`/`Set.of`/`Map.of` và các họ `copyOf` từ chối `null`; `Set.of` từ chối đối số trùng và `Map.of` từ chối khóa trùng.
6. Tính đến chi phí bộ nhớ và kích thước dữ liệu dự kiến. Nút liên kết, metadata giữ thứ tự, nút cây và dung lượng mảng dự phòng có chi phí khác nhau; Big-O không mô tả hết phần bộ nhớ này.
7. Tìm cấu trúc chuyên biệt theo miền trước khi mặc định chọn cấu trúc đa dụng. Nếu phần tử hoặc khóa thuộc cùng một kiểu enum, `EnumSet` hoặc `EnumMap` có thể biểu đạt miền dữ liệu chính xác hơn.
8. Chỉ đo hiệu năng khi hiệu năng thực sự là vấn đề; đừng biến Big-O thành phỏng đoán về tối ưu vi mô.

Ví dụ với cùng dữ liệu `Order`:

```text
cần giữ thứ tự nhập và cho phép phần tử trùng
→ ArrayList<Order>

cần tập `orderId` duy nhất, không quan tâm thứ tự
→ HashSet<Long>

cần tra cứu Order theo id
→ HashMap<Long, Order>

cần ánh xạ theo id và duyệt theo thứ tự chèn
→ LinkedHashMap<Long, Order>

cần xử lý Order theo độ ưu tiên
→ PriorityQueue<Order>
```

Các tiêu chí trên có thể làm thay đổi lựa chọn ngay cả khi hai cách triển khai cùng thỏa một interface. Một collection có độ phức tạp phù hợp vẫn có thể sai nếu nó cho phép thay đổi mà API cần ngăn, từ chối `null` mà bài toán cần, làm mất bảo đảm thứ tự, vi phạm giới hạn của phương thức tạo hoặc mang chi phí cấu trúc không cần thiết cho kiểu sử dụng.

Ưu tiên trả về interface phù hợp với quy ước của API, chẳng hạn `List<Order>` thay vì ép bên gọi phụ thuộc `ArrayList<Order>`, trừ khi tính năng riêng của cách triển khai là một phần cố ý của quy ước.

Chương tiếp theo hoàn tất chặng học này với `EnumSet` và `EnumMap`. Cách biểu diễn chuyên biệt của chúng hữu ích khi miền dữ liệu là enum, nhưng lý do chính để chọn vẫn là quy ước kiểu và thứ tự của chúng khớp với miền bài toán.

An toàn luồng là một trục lựa chọn khác nhưng không nên giải bằng việc “đổi đại” collection ở chương này. Khi dữ liệu được chia sẻ giữa nhiều luồng, cần xét quyền sở hữu, đồng bộ hóa và các collection hỗ trợ truy cập đồng thời trong module về xử lý đồng thời tương ứng.
