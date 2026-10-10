`String.valueOf(...)` là một điểm vào phổ biến để biểu diễn giá trị nguyên thủy hoặc đối tượng dưới dạng String:

```java
String count = String.valueOf(42);
String active = String.valueOf(true);
```

Hành vi với null là một khác biệt đáng nhớ:

```java
String.valueOf((Object) null); // "null"
```

trong khi:

```java
Object value = null;
// value.toString(); // NullPointerException
```

Khi cần tạo đầu ra theo định dạng rõ ràng, Java cũng cung cấp API định dạng:

```java
String message = "User %s has %d points".formatted("Ada", 42);
```

Định dạng không thay đổi bản chất bất biến của String; nó tạo ra một kết quả String.

Nếu định dạng phụ thuộc ngôn ngữ, số, ngày tháng hoặc quy tắc trình bày theo vùng, cần chuyển sang phạm vi của mô-đun Bản địa hóa (Localization) thay vì giả định một định dạng phù hợp cho mọi locale.

Mô hình tư duy cần giữ lại sau chương này:

```text
String API cơ bản
→ đọc trạng thái văn bản
→ tìm vị trí/nội dung
→ trích xuất bằng phạm vi rõ ràng
→ tạo giá trị biến đổi mới
→ tách/ghép nhiều phần
→ chuyển đổi/định dạng thành văn bản đầu ra

không có bước nào sửa đối tượng String cũ tại chỗ
```

Chương tiếp theo tập trung vào một thao tác đặc biệt: **nối chuỗi**, nơi tính bất biến ảnh hưởng trực tiếp tới cách String được xây dựng qua nhiều bước.
