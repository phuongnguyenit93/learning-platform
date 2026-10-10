Ba khái niệm này rất dễ bị gom chung thành “list không sửa được”, nhưng chúng có hành vi khác nhau:

| Dạng | Ví dụ | Có nhìn thấy nguồn đổi? | Có đổi kích thước qua tham chiếu này? |
| --- | --- | --- | --- |
| khung nhìn có thể thay đổi, liên kết với nguồn | `list.subList(...)`, `map.keySet()` | có | tùy thao tác/khung nhìn |
| khung nhìn không cho phép sửa, liên kết với dữ liệu gốc | `Collections.unmodifiableList(source)` | có | không |
| cấu trúc cố định kích thước, liên kết với mảng | `Arrays.asList(array)` | có, hai chiều với mảng | không, nhưng `set` được |
| bản chụp không cho phép sửa | `List.copyOf(source)` | không thấy thay đổi cấu trúc sau khi sao chép | không |

Ví dụ khung nhìn của `Map`:

```java
Map<Long, Order> byId = new HashMap<>();
byId.put(1L, orderA);
byId.put(2L, orderB);

Set<Long> keys = byId.keySet();
keys.remove(1L);

System.out.println(byId.containsKey(1L)); // false
```

Ví dụ `subList`:

```java
List<String> source = new ArrayList<>(List.of("A", "B", "C"));
List<String> tail = source.subList(1, 3);
tail.set(0, "X");

System.out.println(source); // [A, X, C]
```

Ví dụ cấu trúc cố định kích thước:

```java
String[] array = {"A", "B"};
List<String> fixed = Arrays.asList(array);

fixed.set(0, "X");
System.out.println(array[0]); // X

// fixed.add("C"); // UnsupportedOperationException
```

Điểm cần hỏi không phải chỉ là “có gọi được `add` không?”, mà là **tham chiếu này có chia sẻ vùng lưu trữ/trạng thái với nguồn không, thao tác thay đổi nào được phép, và thay đổi từ phía nào sẽ được quan sát ở phía kia?**
