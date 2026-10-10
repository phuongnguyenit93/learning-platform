# Quản lý tài nguyên an toàn với try-with-resources

File, stream, socket, đối tượng JDBC và nhiều tài nguyên bên ngoài heap cần được **đóng đúng thời điểm**. Bộ thu gom rác (Garbage Collector) quản lý bộ nhớ của đối tượng Java, nhưng không phải là cơ chế đảm bảo giải phóng file descriptor, socket hay database handle đúng lúc.

`try-with-resources` (TWR) biến quyền sở hữu tài nguyên và việc dọn dẹp thành một phần rõ ràng của cú pháp.
