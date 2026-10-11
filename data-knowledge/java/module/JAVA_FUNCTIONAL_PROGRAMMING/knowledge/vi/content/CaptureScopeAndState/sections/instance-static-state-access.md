Quy tắc effectively final áp dụng cho biến cục bộ bị bắt giữ. Trường thực thể và trường `static` vẫn tuân theo quy tắc truy cập trường thông thường của Java và có thể được đọc hoặc thay đổi từ lambda nếu chúng nằm trong phạm vi truy cập hợp lệ.

```java
class Counter {
    private int count;
    private static int total;

    Runnable increment = () -> {
        count++;
        total++;
    };
}
```

`count` và `total` là trường nên không phải biến cục bộ bị bắt giữ và không chịu ràng buộc effectively final.

Điều này **không** đồng nghĩa với việc thay đổi trạng thái của trường tự động an toàn. Nếu lambda có thể chạy đồng thời ở nhiều luồng, các vấn đề của Java Memory Model về khả năng nhìn thấy (visibility) và đồng bộ hóa (synchronization) vẫn áp dụng như bình thường. Lambda không tự làm trạng thái có thể thay đổi trở nên an toàn luồng.
