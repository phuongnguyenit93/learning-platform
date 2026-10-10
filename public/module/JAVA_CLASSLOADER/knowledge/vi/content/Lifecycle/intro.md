# ClassLoader là gì? Từ bytecode đến class có thể sử dụng

Khi viết Java, ta thường nhìn thấy một chuỗi rất ngắn:

```text
Main.java
→ javac
→ Main.class
→ java Main
→ chương trình chạy
```

Nhưng tệp `.class` chỉ là **bytecode nằm ở đâu đó**: trong thư mục build, JAR, runtime image của module, thư mục plugin hoặc một nguồn byte khác. JVM không thể thực thi một kiểu chỉ vì một tệp mang tên đó tồn tại. Trước hết JVM phải biết **tìm byte ở đâu, byte đó đại diện cho class nào, các tham chiếu bên trong trỏ tới đâu, trạng thái `static` được chuẩn bị thế nào và khi nào mã khởi tạo được chạy**.

Ở đây **JAR** chỉ là một tệp đóng gói thường dùng để chứa `.class` và tài nguyên của Java. Bạn chưa cần biết chi tiết định dạng JAR để học ClassLoader; chỉ cần hiểu một class có thể nằm trong thư mục hoặc bên trong một JAR thay vì tồn tại như một tệp độc lập.

Đây là chỗ `ClassLoader` xuất hiện.

> **ClassLoader là thành phần tham gia cơ chế nạp class: nó có thể tự tìm/cung cấp biểu diễn nhị phân để JVM tạo `Class` tương ứng, hoặc ủy quyền yêu cầu nạp cho ClassLoader khác.**

Nếu Java không có cơ chế này, môi trường chạy sẽ phải giả định mọi class đều nằm ở một vị trí cố định và thuộc một không gian tên duy nhất. Khi đó các phụ thuộc trong JAR, classpath của ứng dụng, plugin, máy chủ ứng dụng (application server), runtime image của module hay các không gian tên tách biệt gần như không thể hoạt động theo mô hình Java hiện nay.

Trong module này, **không gian tên khi chạy** có thể hiểu là vùng ánh xạ từ tên nhị phân của class tới kiểu khi chạy mà một ClassLoader nhìn thấy hoặc định nghĩa. Hai ClassLoader khác nhau có thể cùng biết tên `com.example.Plugin` nhưng ánh xạ tên đó tới hai `Class<?>` khác nhau.

> **Kiến thức nối từ module trước:** phần này giả định bạn đã biết một class Java có thể được biểu diễn khi chạy bằng `Class<?>`. Nếu `Class<?>`, metadata của kiểu khi chạy hoặc reflection vẫn còn lạ, hãy xem lại module `class-object` và `reflection`. Ở đây ta không học lại Reflection; ta chỉ dùng `Class<?>` như “đại diện khi chạy của một kiểu” để tập trung vào cách kiểu đó được đưa vào JVM.

Một phân biệt phải giữ từ đầu:

```text
plugin/PaymentPlugin.class tồn tại
≠
JVM đã load PaymentPlugin
≠
PaymentPlugin đã được initialize
```

Module này sẽ dùng một plugin rất nhỏ làm ví dụ xuyên suốt:

```text
host
→ ứng dụng chính đang chạy

plugin
→ phần mở rộng được host nạp thêm

Plugin API / SPI
→ interface/contract dùng chung giữa host và plugin

provider
→ class triển khai SPI đó

framework/library
→ mã hạ tầng dùng API/SPI để tìm và gọi provider
```

```text
Plugin API dùng chung
        ↓
PaymentPlugin.class
        ↓
ClassLoader tìm byte và định nghĩa kiểu
        ↓
quan sát định danh, tài nguyên, TCCL, khởi tạo
        ↓
tháo plugin và kiểm tra tham chiếu nào cản việc gỡ nạp
```

Lộ trình của toàn module:

```text
Bytecode trở thành kiểu khi chạy thế nào?
→ Lifecycle
        ↓
JVM có sẵn những ClassLoader nào?
→ Bootstrap / Platform / Application
        ↓
Vì sao ClassLoader thường hỏi ClassLoader cha trước?
→ Parent Delegation
        ↓
Muốn nạp plugin từ nguồn riêng thì sao?
→ Custom ClassLoader
        ↓
Vì sao cùng tên class vẫn có thể là hai kiểu khác nhau?
→ Class Identity
        ↓
Khung phần mềm ở tầng cha tìm provider ở tầng con thế nào?
→ Thread Context ClassLoader
        ↓
Tài nguyên trong classpath được tìm thế nào?
→ Resource Loading
        ↓
Khi nào khởi tạo `static` thật sự chạy?
→ Initialization
        ↓
Vì sao triển khai lại plugin dễ giữ lại cả đồ thị ClassLoader?
→ Gỡ nạp / Rò rỉ
```
