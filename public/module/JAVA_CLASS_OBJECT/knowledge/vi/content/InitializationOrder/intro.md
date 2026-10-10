# Thứ tự khởi tạo

Nhiều lỗi trong quá trình khởi tạo xuất phát từ việc “đúng mã nhưng sai thời điểm”. Java có thứ tự rõ ràng cho **khởi tạo lớp** và **khởi tạo từng đối tượng**; phân biệt hai quá trình này giúp tránh hiểu nhầm rằng phần `static` chạy lại cho mỗi lần `new`.
