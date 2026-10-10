```java
List<String> texts = new ArrayList<>();
List<Integer> numbers = new ArrayList<>();

System.out.println(texts.getClass() == numbers.getClass()); // true
```

Cả hai đối tượng ở lúc chạy đều là instance của cùng class `ArrayList`; JVM không tạo class `ArrayList<String>` và `ArrayList<Integer>` riêng.

Vì vậy lúc chạy không thể lấy một tham chiếu bất kỳ rồi hỏi “đối tượng này có thật sự là `List<String>` không?”:

```java
Object value = new ArrayList<String>();
// if (value instanceof List<String>) { } // compile error
```

Ở lượt học đầu, chỉ cần giữ hai ý tách biệt:

- erasure làm đối tượng ở lúc chạy không mang type argument cụ thể theo cách cho phép kiểm tra tùy ý kiểu phần tử;
- class file có thể giữ **siêu dữ liệu chữ ký generic (generic signature metadata)** của khai báo; module Reflection sẽ học cách đọc metadata đó.
