Continuous recording biến JFR thành một “hộp đen” cho sự cố khó tái hiện.

Cách điển hình:

~~~text
JVM start
→ JFR chạy liên tục với cấu hình mặc định
→ giới hạn maxage/maxsize
→ sự cố xảy ra
→ dump recording trước khi restart
→ phân tích khoảng thời gian ngay trước sự cố
~~~

Lợi ích là không cần biết trước chính xác khi nào lỗi xảy ra. Recording giữ lại cửa sổ lịch sử gần nhất.

Ví dụ startup:

~~~text
-XX:StartFlightRecording=name=continuous,settings=default,disk=true,maxage=2h,maxsize=512m
~~~

Cần kiểm tra dung lượng lưu trữ và chính sách giữ dữ liệu. Recording có thể chứa tên class/method, đường dẫn, ngữ cảnh liên quan request hoặc custom event, nên vẫn phải coi là dữ liệu chẩn đoán trên môi trường production.
