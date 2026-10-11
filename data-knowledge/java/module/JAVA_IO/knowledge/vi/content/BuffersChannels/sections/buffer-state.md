Với `ByteBuffer`, hãy hình dung một dãy ô byte có kích thước cố định:

~~~java
ByteBuffer buffer = ByteBuffer.allocate(8);
~~~

Ngay sau khi cấp phát:

~~~text
capacity = 8
limit    = 8
position = 0
~~~

Ba giá trị có ý nghĩa:

| Giá trị | Ý nghĩa |
| --- | --- |
| `capacity` | Tổng số phần tử buffer có thể chứa; cố định trong vòng đời buffer |
| `position` | Chỉ số của vị trí tiếp theo sẽ được đọc hoặc ghi |
| `limit` | Ranh giới ngay sau phần tử cuối của vùng được phép dùng trong trạng thái hiện tại |

Quan hệ luôn phải thỏa:

~~~text
0 <= position <= limit <= capacity
~~~

Khi đang **ghi dữ liệu vào buffer bằng put**, `position` tiến lên:

~~~java
ByteBuffer buffer = ByteBuffer.allocate(8);

buffer.put((byte) 10);
buffer.put((byte) 20);
buffer.put((byte) 30);
~~~

Trạng thái lúc này:

~~~text
capacity = 8
limit    = 8
position = 3

[10][20][30][?][?][?][?][?]
             ^
             position
~~~

`position = 3` không có nghĩa byte hợp lệ nằm tại chỉ số 3. Nó có nghĩa **chỉ số 3 là nơi thao tác tương đối tiếp theo sẽ bắt đầu**.

Các lệnh `get()` tương đối cũng đọc tại `position` rồi tăng `position`. Vì vậy cùng một buffer có thể được dùng theo hai pha:

~~~text
pha ghi dữ liệu vào buffer
→ position chạy về phía trước

pha đọc dữ liệu ra khỏi buffer
→ position cũng chạy về phía trước
~~~

Muốn đổi giữa hai pha, ta phải cập nhật ranh giới đúng cách.
