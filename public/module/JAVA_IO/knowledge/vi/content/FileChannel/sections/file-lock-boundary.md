**Khóa tệp (file lock)** là một yêu cầu phối hợp với hệ điều hành/hệ thống tệp để đánh dấu rằng một JVM/tiến trình đang giữ quyền truy cập đã thỏa thuận trên toàn bộ tệp hoặc một vùng byte của tệp. Vai trò chính của nó là giúp **nhiều tiến trình phối hợp truy cập cùng một tệp** khi các bên tham gia cùng tôn trọng quy ước khóa.

Hai kiểu thường gặp là:

- **khóa độc quyền (exclusive lock)**: yêu cầu quyền độc quyền trên vùng đó, nên một khóa xung đột khác không nên cùng tồn tại;
- **khóa dùng chung (shared lock)**: cho phép nhiều bên cùng giữ khóa dùng chung tương thích trên vùng đó khi nền tảng hỗ trợ, nhưng vẫn xung đột với khóa độc quyền.

Một yêu cầu khóa dùng chung **có thể bị nền tảng chuyển thành khóa độc quyền** nếu hệ điều hành/hệ thống tệp không hỗ trợ khóa dùng chung. Vì vậy nếu loại khóa thực tế quan trọng, kiểm tra `FileLock.isShared()` trên đối tượng `FileLock` đã nhận được thay vì chỉ nhớ giá trị boolean đã yêu cầu.

`FileChannel` có thể yêu cầu khóa một vùng tệp:

~~~java
try (FileLock lock = channel.lock()) {
    // thao tác cần phối hợp qua khóa tệp
}
~~~

Có thể khóa một vùng byte và yêu cầu chế độ dùng chung/độc quyền:

~~~java
try (FileLock lock =
             channel.lock(position, size, false)) {
    // false: yêu cầu exclusive lock
}
~~~

Sau khi đã hiểu vai trò phối hợp đó, cần nhớ các ranh giới:

- Khóa tệp do Java lấy được giữ thay mặt cho **toàn JVM**, không phải một monitor dành riêng cho một Java thread. Vì vậy không dùng nó thay cho cơ chế đồng bộ giữa các thread trong cùng JVM.
- Cách hệ điều hành/hệ thống tệp cưỡng chế hoặc xem khóa chỉ mang tính thỏa thuận (advisory) có thể khác nhau. Để có tính đúng đắn đa nền tảng, hãy coi đây là cơ chế phối hợp mà các bên tham gia phải tuân thủ.
- Các khóa chồng lấn trong cùng JVM có thể gây `OverlappingFileLockException`.
- Trên một số hệ thống, đóng một channel của tệp có thể làm mất **toàn bộ khóa mà JVM đang giữ trên cùng tệp bên dưới**, kể cả khóa được lấy qua channel khác. Vì vậy mã cần tính di động không nên giả định vòng đời khóa của từng channel luôn tách biệt hoàn toàn với các channel khác mở cùng tệp.
- Khóa không biến nhiều thao tác tệp thành giao dịch cơ sở dữ liệu và không cung cấp giao dịch nghiệp vụ.
- `FileLock` là tài nguyên có vòng đời; phải giải phóng nó, thường bằng `try-with-resources`.

`tryLock()` cho phép thử lấy lock mà không chờ:

~~~java
FileLock lock = channel.tryLock();

if (lock != null) {
    try (lock) {
        // protected work
    }
}
~~~

Nếu bài toán là phối hợp phân tán giữa các dịch vụ, giao dịch qua nhiều tài nguyên hoặc đồng bộ dữ liệu nghiệp vụ, khóa tệp không phải mức trừu tượng phù hợp. Phạm vi của nó là phối hợp quanh một tệp/channel.
