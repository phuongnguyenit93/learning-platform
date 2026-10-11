`Math` là lựa chọn thông thường cho mã ứng dụng.

`StrictMath` tồn tại cho trường hợp cần hành vi của các hàm toán học trên số dấu phẩy động tuân theo yêu cầu chặt hơn về khả năng tái lập kết quả/đặc tả.

```text
Math
→ API tiện ích số mặc định

StrictMath
→ ưu tiên khả năng tái lập đã được đặc tả cho các hàm toán học liên quan
```

Không nên hiểu `StrictMath` là “Math nhưng chính xác tuyệt đối”. Các hàm vẫn hoạt động trên giá trị dấu phẩy động và chịu giới hạn biểu diễn của `double/float`.

Chỉ cần quan tâm ranh giới này khi khả năng tái lập kết quả giữa các nền tảng thực sự là một yêu cầu.

Hai chương tiếp theo chuyển từ cách biểu diễn số sang một nhóm yêu cầu khác: **sinh số ngẫu nhiên**. Sau đó chương tổng hợp sẽ nối các lựa chọn này thành một mô hình ra quyết định thống nhất.
