Java chỉ cho phép phép gán khi quan hệ giữa giá trị và kiểu phù hợp với các quy tắc của ngôn ngữ:

```java
Dog dog = new Dog();
Animal animal = dog; // upcast hợp lệ
```

Chiều ngược lại cần ép kiểu tường minh và kiểm tra ở thời điểm chạy:

```java
Dog again = (Dog) animal;
```

Phép gán kiểu nguyên thủy có bộ quy tắc chuyển đổi khác phép gán kiểu tham chiếu.

Hệ thống kiểu giúp loại bỏ nhiều lỗi trước khi chạy, nhưng không chứng minh mọi thao tác ép kiểu/tham chiếu đều an toàn ở thời điểm chạy.

### Phép gán là hợp đồng ở thời điểm biên dịch

```java
Object value = "java"; // mở rộng kiểu tham chiếu
String text = (String) value; // downcast tường minh + kiểm tra lúc chạy
```

Chuyển đổi kiểu nguyên thủy và kiểu tham chiếu có quy tắc khác nhau:

```java
long n = 10;        // mở rộng kiểu nguyên thủy
Integer boxed = 10; // đóng hộp
```

Không nên dùng từ “cast” để gọi mọi phép chuyển đổi. Phân biệt mở rộng kiểu, thu hẹp kiểu, boxing, unboxing và ép kiểu tham chiếu giúp dự đoán hành vi lúc biên dịch/lúc chạy chính xác hơn.

### Một giá trị có thể được chuyển đổi khác nhau tùy ngữ cảnh

Một trong những nguyên nhân Java dễ gây nhầm là **cùng một giá trị trong mã nguồn nhưng mỗi ngữ cảnh cho phép một bộ chuyển đổi khác nhau**.

| Ngữ cảnh | Mô hình tư duy | Ví dụ |
|---|---|---|
| phép gán | chuyển đổi khi gán | `long x = 10;` |
| số học/toán tử | thăng hạng kiểu số | `byte + byte -> int` |
| gọi phương thức | chuyển đổi khi gọi | `use(long)` nhận đối số `int` qua mở rộng kiểu |
| ép kiểu tường minh | chuyển đổi ép kiểu | `byte b = (byte) x;` |
| ranh giới đối tượng/kiểu nguyên thủy | boxing / unboxing | `Integer n = 10; int x = n;` |

Điểm quan trọng: một phép chuyển đổi hợp lệ ở ngữ cảnh này **không nhất thiết** được trình biên dịch tự áp dụng ở ngữ cảnh khác.

Ví dụ phép gán hằng có quy tắc đặc biệt:

```java
byte a = 1; // hợp lệ: giá trị hằng nằm trong phạm vi byte

void use(byte value) { }
// use(1);   // không biên dịch: lời gọi phương thức không tự dùng phép thu hẹp hằng này
use((byte) 1);
```

Toán tử cũng có quy tắc thăng hạng riêng:

```java
byte x = 1;
byte y = 2;
// byte z = x + y; // x + y có kiểu int
int z = x + y;
```

Khi gặp câu hỏi “tại sao dòng này biên dịch được nhưng dòng gần giống lại không?”, hãy hỏi trước: **đây là ngữ cảnh phép gán, biểu thức toán tử, lời gọi phương thức hay ép kiểu tường minh?**
