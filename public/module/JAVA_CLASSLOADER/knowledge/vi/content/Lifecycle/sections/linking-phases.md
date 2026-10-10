Linking nằm giữa loading và initialization:

```text
load bytes
   ↓
verify
   ↓
prepare
   ↓
resolve
   ↓
initialize khi cần
```

### Kiểm tra (verification)

Verification kiểm tra class-file và các ràng buộc (constraint) quan trọng khi chạy. Mục tiêu là không để JVM thực thi bytecode phá vỡ những bất biến (invariant) mà JVM dựa vào.

Không nên hiểu verification như “compiler chạy lại”. Compiler kiểm tra quy tắc ở mức mã nguồn; verifier làm việc với ràng buộc ở mức class-file/bytecode.

### Chuẩn bị (preparation)

Preparation tạo vùng lưu trữ cho các trường `static` và đặt chúng về giá trị chuẩn bị ban đầu theo quy tắc của JVM.

Ví dụ:

```java
final class PluginState {
    static int loadedPlugins = 10;
    static final int MAX_PLUGINS = 20;
}
```

Cách hình dung hữu ích:

```text
preparation
→ static storage được chuẩn bị
→ static field nhận giá trị mặc định của JVM

initialization
→ constant field có `ConstantValue` được gán giá trị constant theo quy trình initialization
→ executable static field initializer / static block chạy theo semantics của Java
```

Vì vậy không nên đồng nhất “static field đã có storage và default value sau preparation” với “class đã được initialize”. Ngay cả giá trị từ `ConstantValue` cũng thuộc quy trình initialization chứ không phải preparation.

### Phân giải (resolution)

Class file chứa nhiều **tham chiếu ký hiệu (symbolic reference)** như tên class, field và method. Resolution biến các tham chiếu ký hiệu cần thiết thành tham chiếu khi chạy mà JVM có thể dùng trực tiếp.

Ví dụ bytecode của `PaymentPlugin` có thể tham chiếu:

```text
com.example.api.Plugin
java.lang.String
java.util.List
```

JVM phải phân giải chúng theo các quy tắc khi chạy. Resolution có thể được thực hiện ở các thời điểm khác nhau tùy cách triển khai JVM; người học không nên giả định mọi tham chiếu ký hiệu đều được phân giải ngay tại đúng một thời điểm cố định trước khi chương trình bắt đầu.

### Khi class A cần class B, ClassLoader nào được dùng?

Đây là mắt xích nối vòng đời với cơ chế ủy quyền cho ClassLoader cha. Theo quy tắc phân giải của JVM, khi class `A` có tham chiếu ký hiệu tới class/interface `B`, **ClassLoader định nghĩa (defining ClassLoader) của `A` được dùng để khởi xướng việc nạp `B`**. ClassLoader đó có thể tự định nghĩa `B` hoặc tiếp tục ủy quyền cho ClassLoader cha; ClassLoader cuối cùng chịu trách nhiệm định nghĩa `B` mới là defining ClassLoader của `B`.

Với plugin ví dụ:

```text
PaymentPlugin
→ do PluginClassLoader định nghĩa
→ bytecode tham chiếu com.example.api.Plugin
→ JVM cần resolve Plugin
→ yêu cầu loading bắt đầu qua PluginClassLoader
→ PluginClassLoader áp dụng parent delegation
→ parent Application ClassLoader đã có Plugin API
→ trả về cùng Plugin.class dùng chung
```

Điểm quan trọng không phải thuộc lòng từng bước nội bộ của JVM, mà là hiểu rằng phụ thuộc của một class **không được tìm bằng một “ClassLoader toàn cục” duy nhất cho toàn JVM**. ClassLoader định nghĩa của class đang tham chiếu tạo điểm bắt đầu tự nhiên cho việc nạp phụ thuộc. Sau này TCCL xuất hiện chính vì khung phần mềm ở tầng cha đôi lúc cần một ngữ cảnh ClassLoader khác để nhìn thấy thành phần cung cấp ở tầng con.

### Mô hình lỗi — lỗi xảy ra ở giai đoạn nào?

Các lỗi khi nạp class dễ gây nhầm vì nhiều exception/error có tên gần nhau. Hãy quy chúng về câu hỏi JVM đang làm gì:

| Dấu hiệu | Cách hiểu |
| --- | --- |
| `ClassNotFoundException` | Mã chủ động yêu cầu `ClassLoader`/`Class.forName` tìm một tên nhị phân nhưng ClassLoader không tìm được class đó. Đây thường là checked exception của API nạp động. |
| `NoClassDefFoundError` | JVM cần một định nghĩa class trong lúc thực thi/liên kết nhưng định nghĩa đó không còn khả dụng hoặc không thể hoàn tất. Lỗi này cũng có thể xuất hiện ở lần sử dụng chủ động sau khi khởi tạo trước đó đã thất bại. |
| `VerifyError` | Bytecode đã được nạp nhưng verifier phát hiện class-file vi phạm ràng buộc JVM nên class không thể vượt qua bước verification. |
| `ClassFormatError` | Byte đã được tìm thấy nhưng không tạo thành class-file hợp lệ theo định dạng JVM mong đợi. |
| `UnsupportedClassVersionError` | Class-file được biên dịch cho phiên bản class-file mới hơn JVM hiện tại hỗ trợ. |
| `LinkageError` | Nhóm lỗi cho thấy class đã đi tới vùng định nghĩa/liên kết nhưng JVM không thể tạo một hệ kiểu nhất quán; ví dụ `NoClassDefFoundError`, `ClassFormatError`, `NoSuchMethodError` hoặc `IncompatibleClassChangeError`. |

Một luồng chẩn đoán hữu ích:

```text
API động không tìm được tên được yêu cầu?
→ ClassNotFoundException

JVM đang cần phụ thuộc nhưng định nghĩa class không khả dụng?
→ NoClassDefFoundError / LinkageError

đã tìm được bytecode nhưng định dạng/phiên bản sai?
→ ClassFormatError / UnsupportedClassVersionError

khởi tạo static đã thất bại trước đó?
→ lần đầu thường ExceptionInInitializerError
→ lần dùng sau có thể NoClassDefFoundError: Could not initialize class
```

Không nên học các error này như danh sách thuộc lòng. Luôn quay lại ba câu hỏi: **ClassLoader có tìm thấy bytecode không, JVM có định nghĩa/liên kết được không, và khởi tạo đã thành công chưa?**
