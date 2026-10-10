Khi mục tiêu chỉ là chuyển byte giữa các channel, việc tự sao chép từng khối qua một `ByteBuffer` trong Java có thể không cần thiết. `FileChannel` cung cấp:

~~~java
long moved = source.transferTo(position, count, target);
~~~

và:

~~~java
long moved = target.transferFrom(source, position, count);
~~~

Một số JVM/hệ điều hành có thể tối ưu đường truyền này để giảm việc sao chép dữ liệu qua không gian người dùng (user space). Tuy nhiên, “có thể tối ưu” không phải cam kết rằng mọi môi trường đều dùng zero-copy.

Điều quan trọng hơn về tính đúng đắn: **một lần truyền có thể chuyển ít byte hơn số yêu cầu**. mã phải dùng giá trị trả về:

~~~java
long position = 0;
long size = source.size();

while (position < size) {
    long moved =
            source.transferTo(position, size - position, target);

    if (moved <= 0) {
        throw new IOException("Transfer made no progress");
    }

    position += moved;
}
~~~

Điểm của ví dụ là không được coi `moved == 0` như “đã sao chép xong”. Với loại đích có thể tạm thời không nhận dữ liệu, chính sách thực tế có thể là thử lại hoặc dùng phương án dự phòng; với ví dụ tệp-sang-tệp dạng blocking ở đây, báo lỗi khi không có tiến triển giúp tránh vòng lặp vô hạn và tránh trả về một bản sao thiếu mà tưởng là thành công.

Với sao chép tệp thông thường, `Files.copy` thường đơn giản và truyền đạt ý định tốt hơn. `transferTo/transferFrom` đáng quan tâm khi mã đã làm việc ở tầng channel hoặc khi đo đạc/profiling cho thấy đường truyền dữ liệu là điểm nóng cần tối ưu.
