Ba API thường gặp:

### exceptionally

Chỉ chạy khi stage trước thất bại và trả fallback value.

### handle

Nhận cả `(result, exception)` và luôn có thể biến outcome thành value mới.

### whenComplete

Quan sát success/failure nhưng thường không dùng để biến đổi outcome.

Tham khảo:

```text
AsyncController#exceptionHandling()
GET /async/exception
```

Demo tạo failure rồi `handle()` thành một result có kiểm soát.
