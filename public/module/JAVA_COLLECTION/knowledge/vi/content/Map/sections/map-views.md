`keySet()`, `values()` và `entrySet()` không mặc định tạo ba collection độc lập. Chúng là **khung nhìn liên kết với Map gốc**: thay đổi hợp lệ qua một phía có thể được quan sát từ phía còn lại.

```java
Map<Long, String> names = new HashMap<>();
names.put(1L, "An");
names.put(2L, "Binh");

Set<Long> keys = names.keySet();
keys.remove(1L);

System.out.println(names.containsKey(1L)); // false

names.put(3L, "Chi");
System.out.println(keys.contains(3L));      // true
```

Các khung nhìn không hỗ trợ mọi thao tác thay đổi dữ liệu. Ví dụ `keySet().add(key)` không có đủ thông tin để tạo một ánh xạ vì không biết giá trị, nên thao tác đó không được hỗ trợ. Khi cần bản chụp độc lập, hãy tạo bản sao rõ ràng:

```java
Set<Long> keySnapshot = Set.copyOf(names.keySet());
List<String> valueSnapshot = List.copyOf(names.values());
```

Đây là cùng một nhóm khái niệm với `List.subList`: **khung nhìn chia sẻ trạng thái với nguồn**, còn bản sao có trạng thái cấu trúc riêng.
