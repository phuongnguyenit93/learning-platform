`intern()` có thể giảm số đối tượng tham chiếu khác nhau cho một tập String lặp lại nhiều, nhưng không phải tối ưu mặc định cho mọi ứng dụng.

Chi phí/cân nhắc gồm:

- chi phí tra cứu và chuẩn hóa;
- tăng quy mô và chi phí quản lý của bảng String khi intern nhiều giá trị;
- tăng áp lực bộ nhớ/tra cứu nếu dữ liệu có số lượng giá trị khác nhau rất lớn;
- làm mã phụ thuộc không cần thiết vào định danh tham chiếu.

### Số lượng giá trị khác nhau lớn và đầu vào không tin cậy

Nếu các giá trị được intern gần như đều duy nhất:

```text
user-000001
user-000002
user-000003
...
```

việc chuẩn hóa có thể không đem lại lợi ích loại bỏ trùng lặp đáng kể nhưng vẫn thêm chi phí tra cứu và áp lực lên cấu trúc quản lý String đã intern.

Đặc biệt không nên intern dữ liệu do người dùng kiểm soát có số lượng giá trị khác nhau rất lớn chỉ vì “tiết kiệm bộ nhớ”.

### Không dựa vào quan niệm cũ về JVM

Các câu kiểu “interned strings luôn nằm ở PermGen” hoặc “đã intern thì chắc chắn bị giữ mãi đến khi JVM kết thúc” đều không phải hợp đồng của ngôn ngữ Java. Vị trí lưu, cấu trúc bảng và hành vi thu gom là chi tiết triển khai của JVM.

Ứng dụng nên cân nhắc theo:

```text
định danh tham chiếu chuẩn hóa
chi phí tra cứu
đặc điểm bảng String và bộ nhớ
số lượng giá trị khác nhau trong khối lượng xử lý
```

Chỉ intern khi khối lượng xử lý và đo đạc thực tế cho thấy lợi ích rõ ràng, hoặc hợp đồng thực sự cần một tham chiếu chuẩn hóa.

Chương tiếp theo rời khỏi bài toán định danh tham chiếu để xây mô hình Unicode bên trong `String`: **`char`, điểm mã Unicode và ký tự người dùng nhìn thấy khác nhau thế nào?** Sau đó mô-đun mới đi qua ranh giới văn bản ↔ byte bằng Charset.
