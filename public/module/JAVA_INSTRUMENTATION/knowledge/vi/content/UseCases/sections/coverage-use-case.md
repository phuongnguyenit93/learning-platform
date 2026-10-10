Coverage agent chèn marker/counter để biết code nào đã thực thi.

Ví dụ khái niệm:

~~~java
if (condition) {
    // probe A
    process();
} else {
    // probe B
    fallback();
}
~~~

Transformer có thể đặt probe tại:

- method entry;
- basic block;
- branch;
- điểm ánh xạ dòng.

Sau lần chạy kiểm thử, helper runtime tổng hợp probe ID thành báo cáo coverage.

Khó khăn không chỉ là chèn counter. Agent phải giữ:

- line number/debug attribute đủ chính xác;
- luồng điều khiển hợp lệ;
- các đường thoát bằng exception;
- chính sách cho code generated/synthetic;
- tính duy nhất của vùng lưu probe theo class loader.

Coverage là ví dụ tốt cho “instrumentation bổ sung”: kết quả nghiệp vụ không nên đổi; chỉ thêm dữ liệu quan sát.
