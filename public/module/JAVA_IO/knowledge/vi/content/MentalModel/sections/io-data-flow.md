Một chương trình cần một mô hình thống nhất để **đọc dữ liệu từ nguồn (source)** và **ghi dữ liệu tới đích (sink)**. Nguồn hoặc đích có thể là tệp, bảng điều khiển, socket, thiết bị hoặc thậm chí một vùng nhớ nằm ngay trong tiến trình hiện tại. I/O tồn tại để mô hình hóa những lần trao đổi dữ liệu đó mà không buộc mã ứng dụng phải tạo một cơ chế hoàn toàn khác cho từng loại đầu cuối.

Khi nguồn hoặc đích là tài nguyên nằm ngoài vùng nhớ Java thông thường, chẳng hạn tệp hoặc socket, chương trình còn đi qua một **ranh giới tài nguyên (resource boundary)** có vòng đời riêng. Đối tượng, biến cục bộ và mảng trong RAM không tự trở thành dữ liệu bền vững khi tiến trình kết thúc; dữ liệu cần tồn tại lâu hơn các đối tượng đó phải được ghi tới một nơi lưu trữ phù hợp.

**I/O (Input/Output - vào/ra)** là nhóm cơ chế dùng để đưa dữ liệu **vào** chương trình và đưa dữ liệu **ra khỏi** chương trình.

Có thể bắt đầu bằng mô hình rất đơn giản:

```text
nguồn ── dữ liệu vào ──> chương trình ── dữ liệu ra ──> đích
```

- **Nguồn (source)** là nơi dữ liệu đi ra, ví dụ tệp, **socket** (đầu cuối mạng mà chương trình dùng để trao đổi dữ liệu), bàn phím hoặc một vùng nhớ.
- **Đích (sink)** là nơi nhận dữ liệu, ví dụ tệp, socket, màn hình hoặc một vùng nhớ.
- **Dữ liệu truyền (payload)** là phần dữ liệu đang được di chuyển.
- **Ranh giới tài nguyên (resource boundary)** là chỗ mã Java bắt đầu làm việc với một tài nguyên có vòng đời riêng, thường do hệ điều hành hoặc một thành phần bên ngoài tiến trình quản lý. Không phải mọi mô hình I/O đều đi qua ranh giới này; luồng đọc từ mảng byte trong RAM là một ví dụ.

Ví dụ một ứng dụng ghi dòng chữ `Xin chào Java ☕` vào tệp rồi đọc lại có luồng:

```text
String trong RAM
    ↓ mã hóa thành byte
tệp tạm trên hệ thống tệp
    ↓ đọc byte + giải mã
String mới trong RAM
```

Nếu chỉ giữ chuỗi ban đầu trong RAM, dữ liệu biến mất khi tiến trình kết thúc. Khi ghi xuống tệp, chương trình tạo ra một biểu diễn có thể tồn tại độc lập với đối tượng đang nằm trong **heap**, vùng bộ nhớ JVM thường dùng để chứa các đối tượng Java.

**Hệ thống tệp (filesystem)** là cơ chế của hệ điều hành dùng để tổ chức tệp, thư mục và thông tin đi kèm của chúng. Thông tin đi kèm đó gọi là **siêu dữ liệu (metadata)**, ví dụ một mục có tồn tại hay không, loại mục, kích thước hoặc thời điểm sửa đổi; siêu dữ liệu khác với chính nội dung byte của tệp.

**Đệm dữ liệu (buffering)** khác với **nơi lưu trữ hoặc tài nguyên bên dưới**. Bộ đệm chỉ là vùng nhớ tạm dùng để gom dữ liệu và giảm số thao tác I/O nhỏ; nó không tự làm dữ liệu trở nên bền vững. Tệp, socket hoặc thiết bị mới là nguồn/đích mà bộ đệm hỗ trợ giao tiếp.

Trong module này, các thuật ngữ sẽ xuất hiện theo một lộ trình có quan hệ với nhau:

```text
luồng dữ liệu I/O
    ↓ dữ liệu cần một đơn vị truyền
luồng byte
    ↓ văn bản cần tầng chuyển đổi ký tự
luồng ký tự
    ↓ nhiều thao tác nhỏ có thể tốn chi phí
lớp bọc và bộ đệm
    ↓ tệp còn có tên, đường dẫn và siêu dữ liệu
File → Path / Files
    ↓ NIO tách vùng chứa dữ liệu khỏi đường vận chuyển
Buffer / Channel / FileChannel
    ↓ tài nguyên bên ngoài cần bên chịu trách nhiệm cho vòng đời
quản lý tài nguyên
    ↓ một số dữ liệu có thể biểu diễn thành đồ thị đối tượng
tuần tự hóa
    ↓ cuối cùng chọn mô hình đơn giản nhưng đúng
lựa chọn I/O
```

Các thành phần chính và vai trò của chúng:

| Thành phần | Vai trò |
| --- | --- |
| Luồng byte | Đọc/ghi dữ liệu thô dưới dạng byte; khi byte mang các giá trị nguyên thủy có cấu trúc thì cần thêm quy tắc rõ ràng về thứ tự trường và kiểu dữ liệu. |
| Luồng ký tự + `Charset` | Làm việc với văn bản và chuyển đổi đúng giữa ký tự với byte. |
| Đệm dữ liệu | Gom nhiều thao tác nhỏ thành các khối lớn hơn để giảm chi phí I/O. |
| `File` so với `Path` / `Files` | Biểu diễn và thao tác với vị trí/siêu dữ liệu trên hệ thống tệp; `File` là API cũ, `Path`/`Files` là mô hình hiện đại hơn. |
| `WatchService` | Nhận thông báo thay đổi hệ thống tệp như tạo/sửa/xóa với ranh giới phụ thuộc nhà cung cấp hệ thống tệp và nền tảng. |
| `Buffer` / `Channel` / `FileChannel` | Mô hình NIO tách vùng dữ liệu khỏi kênh truyền; `ByteOrder` quyết định cách hiểu giá trị nguyên thủy nhiều byte và channel có thể truyền qua nhiều bộ đệm. |
| `AsynchronousFileChannel` | I/O tệp theo vị trí với kết quả hoàn tất bất đồng bộ thay vì giữ luồng thực thi gọi API chờ tới khi xong. |
| Quản lý tài nguyên | Xác định ai chịu trách nhiệm cho tài nguyên và khi nào phải `close()`. |
| Tuần tự hóa | Chuyển trạng thái đối tượng theo một định dạng tuần tự hóa cụ thể. |
| Lựa chọn I/O | Chọn mô hình/API đơn giản và đúng với loại dữ liệu, quy mô và kiểu thao tác. |

**NIO (New I/O)** là nhóm API I/O mới hơn của Java, gồm các khái niệm như `Buffer`, `Channel` và `java.nio.file`. Ở đây chỉ cần xem nó như một họ mô hình I/O khác sẽ được học sau; không phải mọi API NIO đều là không chặn.

Điểm cần giữ từ đầu là: I/O không đồng nghĩa với “đọc tệp”. Tệp chỉ là một loại nguồn/đích. Cùng mô hình nguồn → dữ liệu → đích còn áp dụng cho mạng, bảng điều khiển, luồng trong bộ nhớ và nhiều thiết bị khác.
