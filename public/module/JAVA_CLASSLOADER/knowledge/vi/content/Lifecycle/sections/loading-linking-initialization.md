### KHÁI NIỆM — ClassLoader tham gia vào đoạn nào?

Ở mức cơ bản, **`ClassLoader` tham gia biến một tên nhị phân (binary name) thành `Class<?>` khi chạy bằng cách tự tìm/cung cấp bytecode phù hợp hoặc ủy quyền việc nạp cho ClassLoader khác**. JVM dùng kết quả đó để tạo kiểu khi chạy rồi tiếp tục liên kết (linking) và khởi tạo (initialization). Nó giải quyết khoảng cách giữa “bytecode đang tồn tại ở đâu đó” và “JVM đã có một kiểu với định danh rõ ràng để liên kết, khởi tạo và sử dụng”.

Nếu môi trường chạy chỉ biết một vị trí cố định và một không gian tên duy nhất, Java sẽ rất khó hỗ trợ classpath của ứng dụng, phụ thuộc trong JAR, plugin, container, bytecode được sinh động hoặc các vùng nạp class tách biệt. Vì vậy ClassLoader không phải một API phụ để “đọc tệp `.class`”; nó là một phần của cơ chế đưa kiểu vào JVM theo đúng không gian tên và vòng đời khi chạy.

### Tên nhị phân (binary name), đường dẫn tệp .class và classpath khác nhau như thế nào?

Giả sử mã nguồn là:

```java
package com.example.plugins;

public final class PaymentPlugin {
}
```

Với class cấp cao nhất này:

```text
binary name
→ com.example.plugins.PaymentPlugin

đường dẫn tệp .class thông thường tính từ một gốc classpath
→ com/example/plugins/PaymentPlugin.class
```

`ClassLoader.loadClass(...)` làm việc với **tên nhị phân**, không nhận một đường dẫn hệ thống tệp kiểu `C:\\...\\PaymentPlugin.class`.

**Classpath** có thể hiểu đơn giản là tập các vị trí mà Application/System ClassLoader được cấu hình để tìm class và tài nguyên, ví dụ:

```text
build/classes/java/main/
libs/payment-plugin.jar
libs/common-api.jar
```

Nếu một gốc classpath là `build/classes/java/main/`, ClassLoader có thể ánh xạ:

```text
com.example.plugins.PaymentPlugin
        ↓
com/example/plugins/PaymentPlugin.class
```

rồi tìm đường dẫn tương đối đó bên dưới gốc classpath. Nếu gốc là JAR, mục tương ứng nằm **bên trong JAR**, không phải là một tệp `.class` độc lập trên hệ thống tệp.

Vì vậy cần tách bốn khái niệm. Với class cấp cao nhất, một số tên có thể nhìn giống nhau về mặt chữ, nhưng **vai trò của chúng khác nhau**:

```text
package/source naming
binary class name
class-file/resource path
classpath location
```

> **Nâng cao — có thể bỏ qua ở lượt học đầu:** module path và named module bổ sung thêm quy tắc về khả năng nhìn thấy và đóng gói. Mô hình nền vẫn là: **ClassLoader nhận tên khi chạy và tìm biểu diễn phù hợp trong những vị trí mà nó nhìn thấy**.

### Khi nào JVM bắt đầu nạp một class?

Không nên hình dung JVM đọc toàn bộ mọi `.class` ngay lúc ứng dụng khởi động. Java thường nạp class **theo nhu cầu (demand-driven)**: một kiểu được nạp/liên kết khi JVM cần nó để thực hiện một thao tác, phân giải phụ thuộc, reflection/nạp động hoặc phục vụ một kiểu khác đang được xử lý.

Ví dụ:

```java
import com.example.plugins.PaymentPlugin;

public class Demo {
    public static void main(String[] args) {
        System.out.println("start");
    }
}
```

Dòng `import` chỉ giúp **compiler** hiểu tên trong mã nguồn. Bản thân `import` không phải lệnh khi chạy và không có nghĩa `PaymentPlugin` đã được nạp hoặc khởi tạo khi `Demo` chạy.

Ngược lại, các thao tác như sau có thể làm JVM cần một kiểu:

```text
new PaymentPlugin()
gọi/đọc member cần resolve type liên quan
Class.forName("com.example.plugins.PaymentPlugin")
loader.loadClass("com.example.plugins.PaymentPlugin")
JVM resolve symbolic reference từ class khác
```

Không nên dựa vào một thời điểm nạp tuyệt đối cho mọi JVM. JVM có thể thực hiện một số bước nạp/liên kết sớm hơn khi đặc tả cho phép, miễn là không làm thay đổi ngữ nghĩa quan sát được. Điều cần giữ là: **không phải mọi class đều được nạp ngay lúc khởi động, và nạp vẫn khác khởi tạo**.

JVM Specification mô tả quá trình tạo class/interface khi chạy theo ba giai đoạn lớn:

```text
Loading
→ Linking
→ Initialization
```

- **Loading (nạp)** tìm biểu diễn nhị phân của kiểu và tạo `Class` khi chạy.
- **Linking (liên kết)** kiểm tra và chuẩn bị kiểu để có thể dùng an toàn trong JVM.
- **Initialization (khởi tạo)** chạy phần khởi tạo `static` mà chương trình đã khai báo.

`ClassLoader` gắn trực tiếp nhất với **loading (nạp)**. Tuy vậy, khi gọi các API như `loadClass`, `Class.forName` hoặc dùng kiểu lần đầu, người học thường quan sát cả chuỗi vòng đời nên cần hiểu ranh giới giữa ba giai đoạn.

### VÌ SAO — vì sao không chạy bytecode ngay khi tìm thấy tệp?

Một tệp có đuôi `.class` chưa chứng minh rằng nó:

- có định dạng class-file hợp lệ;
- thật sự mang tên nhị phân mà JVM đang yêu cầu;
- tham chiếu đến những kiểu/thành viên hợp lệ;
- tương thích với các ràng buộc của JVM;
- đã có trạng thái `static` sẵn sàng;
- đã chạy bộ khởi tạo `static`.

JVM tách vòng đời thành nhiều bước để có thể kiểm tra tính đúng đắn, trì hoãn công việc chưa cần thiết và chỉ chạy tác dụng phụ của khởi tạo khi ngữ nghĩa yêu cầu.

### MỐI LIÊN HỆ — mã nguồn, bytecode, ClassLoader và `Class<?>`

```text
mã nguồn
  ↓ javac
bytecode của class
  ↓ ClassLoader/JVM nạp class
đối tượng Class<?> khi chạy
  ↓ liên kết
kiểu đã sẵn sàng về mặt cấu trúc
  ↓ khởi tạo khi có active use
khởi tạo static đã hoàn tất
```

`Class<?> pluginType` là metadata của kiểu khi chạy đã được JVM tạo. Nó không phải tệp `.class`, dù hai thứ liên quan trực tiếp.

### CƠ CHẾ — quan sát ClassLoader của một kiểu

```java
public final class PluginLifecycleDemo {
    public static void main(String[] args) {
        Class<?> type = PluginLifecycleDemo.class;

        System.out.println(type.getName());
        System.out.println(type.getClassLoader());
    }
}
```

Class của ứng dụng thông thường sẽ gắn với Application/System ClassLoader. Các ClassLoader cụ thể sẽ được tách riêng ở chương tiếp theo.

### MINH CHỨNG — điều cần đọc từ ví dụ

Khi `PluginLifecycleDemo.class` đã tồn tại trên classpath, JVM vẫn phải tạo biểu diễn khi chạy cho nó trước khi mã có thể chạy. Từ đây hãy luôn phân biệt:

```text
artifact chứa bytecode
→ đầu vào

ClassLoader + vòng đời JVM
→ cơ chế biến đầu vào thành kiểu khi chạy

Class<?>
→ định danh/metadata khi chạy đã được tạo
```
