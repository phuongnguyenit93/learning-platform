Một `HttpClient` không chỉ là đối tượng chứa method `send`. Oracle API mô tả client cung cấp **cấu hình và khả năng chia sẻ tài nguyên** cho mọi request đi qua nó, và cách triển khai mặc định thường quản lý connection pool có thể tái sử dụng kết nối khi cần.

Điều này dẫn tới hai nguyên tắc về trách nhiệm sở hữu:

1. Tái sử dụng client ở phạm vi phù hợp với nhóm request cùng cấu hình thay vì tạo một client cho từng lời gọi.
2. Nếu nhiều thành phần dùng chung client, chúng cũng đang dùng chung vòng đời của tài nguyên bên dưới; một thành phần không nên tự đóng client nếu nó không sở hữu client đó.

Việc tái sử dụng kết nối là hành vi của cách triển khai/tài nguyên, không phải bảo đảm của API rằng request B chắc chắn dùng đúng socket của request A. Phiên bản protocol, đích đến, thời điểm response body hoàn tất, hành vi của server và các điều kiện transport khác đều ảnh hưởng khả năng tái sử dụng.

Đặc biệt, response body chưa được tiêu thụ có thể giữ trao đổi/kết nối ở trạng thái bận. Handler materialize như `ofString()` thường hoàn tất body trước khi trả giá trị body, còn streaming handler chuyển trách nhiệm tiếp tục tiêu thụ/đóng sang bên gọi.

```text
Dùng chung HttpClient
   ├── cấu hình dùng chung
   ├── kết nối/tài nguyên được quản lý
   └── nhiều trao đổi HttpRequest
          ↓
   vòng đời body phải được hoàn tất
   để tài nguyên có thể được giải phóng/tái sử dụng phù hợp
```

Không dựa vào chi tiết triển khai của connection pool để xây dựng tính đúng đắn của protocol ứng dụng. Tái sử dụng là tối ưu hóa/quản lý tài nguyên của client; tính đúng đắn phải dựa trên HTTP semantics và contract của ứng dụng.
