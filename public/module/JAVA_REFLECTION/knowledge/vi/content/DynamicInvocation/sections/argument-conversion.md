Chữ ký của `Method.invoke` là `invoke(Object obj, Object... args)`, nên các đối số đi qua một `Object[]`. Điều đó không có nghĩa lúc chạy Reflection chấp nhận mọi kiểu rồi tự ép kiểu tùy ý.

Với tham số hình thức primitive, Reflection có thể mở hộp wrapper và thực hiện các chuyển đổi hợp lệ khi gọi method, bao gồm mở rộng primitive. Chuyển đổi thu hẹp (narrowing) không được tự động thực hiện.

Ví dụ với một hàm hỗ trợ nhỏ:

```java
final class Counter {
    public void record(long value) {
        System.out.println(value);
    }
}

Method record = Counter.class.getMethod("record", long.class);
Counter counter = new Counter();

record.invoke(counter, Integer.valueOf(7)); // int -> long: hợp lệ
record.invoke(counter, Long.valueOf(7));    // long -> long: hợp lệ
record.invoke(counter, null);               // fail: null không unbox thành long
```

Ngược lại, nếu tham số hình thức là `int`, truyền `Long` sẽ cần thu hẹp từ `long` xuống `int`; `Method.invoke()` không thực hiện chuyển đổi đó và sẽ ném `IllegalArgumentException`.

Đối số kiểu tham chiếu phải gán được cho kiểu tham chiếu hình thức. `null` hợp lệ cho tham số tham chiếu nhưng không hợp lệ cho tham số primitive. Giá trị trả về primitive được box lại thành wrapper; method `void` trả về `null` qua `invoke()`.

Một ranh giới dễ gây nhầm khác là varargs. `Method.invoke()` bản thân là varargs API, còn method đích cũng có thể là varargs. Reflection không thay thế logic của trình biên dịch cho mọi cách viết lời gọi trong mã nguồn; mã động nên chuẩn bị mảng đối số đúng cấu trúc mà method đích thực sự nhận.

Điểm thực hành quan trọng là kiểm tra siêu dữ liệu và đối số trước khi gọi nếu đầu vào đến từ cấu hình, plugin hoặc dữ liệu đã được tuần tự hóa. Nếu không, lỗi kiểu sẽ chỉ xuất hiện lúc chạy ngay tại `invoke()`.
