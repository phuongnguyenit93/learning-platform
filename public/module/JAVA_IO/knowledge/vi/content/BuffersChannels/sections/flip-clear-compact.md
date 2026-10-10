Giả sử ta vừa ghi 3 byte vào buffer:

~~~text
position = 3
limit    = 8
capacity = 8
~~~

Nếu gọi `get()` ngay, buffer sẽ bắt đầu đọc từ chỉ số 3 chứ không quay lại ba byte vừa ghi. Trước khi tiêu thụ dữ liệu, gọi:

~~~java
buffer.flip();
~~~

`flip()` biến trạng thái theo ý tưởng:

~~~text
limit = position cũ
position = 0
~~~

Kết quả:

~~~text
position = 0
limit    = 3
capacity = 8

[10][20][30][?][?][?][?][?]
 ^           ^
 position    limit
~~~

Bây giờ vùng có dữ liệu cần đọc là `[position, limit)`:

~~~java
while (buffer.hasRemaining()) {
    System.out.println(buffer.get());
}
~~~

Sau khi đọc hết:

~~~text
position = 3
limit    = 3
~~~

Nếu toàn bộ dữ liệu cũ đã được tiêu thụ và muốn dùng lại toàn bộ buffer cho vòng ghi mới:

~~~java
buffer.clear();
~~~

`clear()` đặt:

~~~text
position = 0
limit    = capacity
~~~

Tên `clear` dễ gây hiểu nhầm: nó **không xóa hoặc điền số 0 vào byte cũ**. Nó chỉ thay đổi siêu dữ liệu trạng thái để toàn bộ vùng Buffer có thể bị ghi đè trong vòng tiếp theo.

Ngoài `position/limit/capacity`, `Buffer` còn có một **mark** tùy chọn. `mark()` ghi nhớ `position` hiện tại; `reset()` đưa `position` quay lại mark đó. Mark bị hủy bởi các thao tác như `clear()`, `flip()` và `rewind()`, nên không nên coi nó là dấu trang tồn tại qua mọi lần chuyển trạng thái.

`rewind()` đặt `position = 0` nhưng **giữ nguyên `limit`**, nên phù hợp khi muốn đọc lại cùng vùng dữ liệu từ đầu. Nó khác `clear()`, vì `clear()` mở lại toàn bộ `[0, capacity)` cho một pha ghi mới.

`compact()` dành cho tình huống vẫn còn dữ liệu chưa tiêu thụ. Giả sử sau `flip()` buffer có 6 byte hợp lệ, nhưng chương trình mới đọc 2 byte:

Giống `clear()`, `flip()` và `rewind()`, `compact()` cũng **hủy mark** nếu buffer đang có mark.

~~~text
position = 2
limit    = 6
capacity = 8

[A][B][C][D][E][F][?][?]
       ^           ^
       position    limit
~~~

Gọi:

~~~java
buffer.compact();
~~~

Các byte chưa đọc `[C][D][E][F]` được sao chép về đầu buffer. Sau đó:

~~~text
[C][D][E][F][...free space...]
             ^
             position = 4

limit = capacity = 8
~~~

Buffer đã sẵn sàng nhận thêm dữ liệu mà không làm mất phần còn lại. Sau khi ghi thêm, gọi `flip()` trước khi chuyển lại sang đọc.

Chu trình dễ nhớ:

~~~text
ghi vào buffer
→ flip()
→ đọc khỏi buffer
→ clear() nếu đã đọc hết
  hoặc compact() nếu còn dữ liệu chưa đọc
→ ghi tiếp
~~~

Nếu `put` cố ghi vượt `limit`, `BufferOverflowException` có thể xảy ra. Nếu `get` cố đọc vượt `limit`, `BufferUnderflowException` có thể xảy ra. Hai lỗi này thường là tín hiệu rằng mã đã hiểu sai trạng thái buffer.
