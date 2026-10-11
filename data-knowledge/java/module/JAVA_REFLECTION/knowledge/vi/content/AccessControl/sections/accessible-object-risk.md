Việc bỏ qua kiểm tra truy cập tạo ra sức mạnh giống framework: serializer, dependency injection container hay mapper có thể đọc constructor/field mà mã ứng dụng bình thường không gọi trực tiếp. Sức mạnh này đi cùng sự phụ thuộc chặt vào chi tiết phần triển khai.

Nếu một công cụ dựa vào `provider`, `processedCount` hoặc `internalStatus()`, các thành phần đó về mặt ngôn ngữ vẫn là private nhưng thực tế đã trở thành hợp đồng ngầm của công cụ. Đổi tên field, đổi constructor, chuyển package hoặc bật tính đóng gói mạnh có thể làm tích hợp hỏng lúc chạy thay vì được trình biên dịch báo ngay.

Reflection cũng không bảo đảm mọi `final` field có thể bị sửa. Java 21 coi một số final field là không thể sửa qua `AccessibleObject`, gồm `static final`, final field của record và final field của hidden class; bật cờ bỏ qua kiểm tra truy cập có thể cho đọc nhưng không mở quyền ghi cho những field đó.

Vì vậy khi thiết kế code dùng Reflection:

1. ưu tiên hợp đồng public/protected hoặc interface nếu cấu trúc đã biết;
2. chỉ dùng truy cập phản chiếu sâu ở ranh giới thật sự cần hành vi động;
3. kiểm tra `trySetAccessible()` thay vì giả định quyền truy cập;
4. giữ tên thành phần và logic truy cập tập trung ở một lớp adapter/siêu dữ liệu;
5. coi mức độ mở của mô-đun là một phần của hợp đồng tích hợp.

Sau khi hiểu ranh giới truy cập, bước tiếp theo là một loại siêu dữ liệu khác: kiểu generic. Java xóa phần lớn thông tin generic ở lúc chạy để thực thi, nhưng vẫn giữ lại một số siêu dữ liệu chữ ký để Reflection có thể đọc.
