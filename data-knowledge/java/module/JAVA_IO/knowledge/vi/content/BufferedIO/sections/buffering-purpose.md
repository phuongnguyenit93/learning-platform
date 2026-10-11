Bộ đệm là một vùng nhớ tạm nằm giữa mã ứng dụng và tài nguyên/tầng I/O bên dưới. Lớp bọc có bộ đệm gom nhiều thao tác nhỏ trước khi chuyển dữ liệu xuống đối tượng được bọc.

```text
nhiều lần đọc nhỏ                  ít lần đọc lớn hơn
ứng dụng <── bộ đệm <───────────────────────── nguồn

nhiều lần ghi nhỏ                  ít lần ghi lớn hơn
ứng dụng ──> bộ đệm ─────────────────────────> đích
```

Khi đọc, lớp bọc có thể lấy một khối dữ liệu từ luồng bên dưới rồi phục vụ nhiều lời gọi nhỏ từ bộ nhớ; việc lấy khối tiếp theo vào bộ đệm thường được gọi là **nạp lại (refill)**. Khi ghi, lớp bọc có thể giữ nhiều phần dữ liệu nhỏ trong bộ nhớ rồi đẩy xuống dưới theo khối.

Lợi ích chính thường là giảm số lần đi qua **ranh giới** phải gọi xuống tầng I/O hoặc hệ điều hành có chi phí cao hơn. Đệm dữ liệu không làm thay đổi nội dung và cũng không tự biến mọi thuật toán thành nhanh hơn; hiệu quả phụ thuộc nguồn/đích, kích thước thao tác và việc tầng bên dưới đã có bộ đệm hiệu quả hay chưa.

Ví dụ, ghi từng byte trực tiếp:

```java
for (byte value : data) {
    out.write(value);
}
```

nếu `out` là `BufferedOutputStream`, các lần `write` nhỏ được gom trước khi chuyển xuống luồng đầu ra bên dưới.
