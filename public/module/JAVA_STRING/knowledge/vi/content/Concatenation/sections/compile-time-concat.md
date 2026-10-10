Nếu toàn bộ biểu thức nối là **biểu thức hằng (constant expression)**, Java đánh giá nó tại thời điểm biên dịch:

```java
String value = "ja" + "va";
```

kết quả là một hằng String và được intern, nên trong ví dụ này nó dùng cùng tham chiếu chuẩn hóa với literal `"java"`.

Đây là lý do `==` trong những ví dụ **biểu thức hằng** như trên có thể cho `true` theo quy ước của Java; không được suy rộng điều đó sang phép nối có giá trị chỉ biết khi chương trình chạy.

Biến hằng cũng có thể tham gia:

```java
final String left = "ja";
String a = left + "va";
String b = "java";

System.out.println(a == b); // true
```

### `final` chưa chắc là hằng số tại thời điểm biên dịch

Một biến `final` chỉ tham gia biểu thức hằng khi nó thực sự là **biến hằng (constant variable)**:

```java
final String prefix = "ja";
String a = prefix + "va";
String b = "java";

System.out.println(a == b); // true
```

Nhưng giá trị chỉ biết khi chương trình chạy thì khác:

```java
final String prefix = args.length > 0 ? args[0] : "ja";
String a = prefix + "va";
String b = "java";

System.out.println(a.equals(b)); // câu hỏi về nội dung
```

`final` nghĩa là tham chiếu không được gán lại; nó không tự động biến mọi biểu thức khi chạy thành hằng số tại thời điểm biên dịch. Điểm quyết định là **biểu thức hằng tại thời điểm biên dịch**, không chỉ từ khóa `final`.
