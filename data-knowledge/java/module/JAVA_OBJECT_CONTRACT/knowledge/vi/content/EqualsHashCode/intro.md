# Sự nhất quán giữa equals và hashCode

`equals` và `hashCode` không nên được thiết kế độc lập. Với cấu trúc dữ liệu dựa trên mã băm, chúng tạo thành **một quy ước chung**: mã băm giúp thu hẹp vùng tìm kiếm, còn `equals` xác nhận đối tượng có thực sự khớp hay không.

Chương trước học từng phần riêng. Chương này tập trung vào **cách `equals` và `hashCode` phối hợp trong quá trình tra cứu** và hậu quả khi chạy nếu quy ước bị phá vỡ.
