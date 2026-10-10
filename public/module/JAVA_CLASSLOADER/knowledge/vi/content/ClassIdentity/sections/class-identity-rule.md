Cách hiểu cốt lõi:

```text
định danh class khi chạy
= tên nhị phân (binary name)
  +
định danh của ClassLoader định nghĩa
```

Ví dụ:

```text
("com.example.PaymentPlugin", loaderA)
≠
("com.example.PaymentPlugin", loaderB)
```

nếu `loaderA != loaderB`.

`Class#getClassLoader()` cho phép quan sát ClassLoader định nghĩa của một class thông thường:

```java
Class<?> type = PaymentPlugin.class;

System.out.println(type.getName());
System.out.println(type.getClassLoader());
```

Class do Bootstrap ClassLoader định nghĩa là trường hợp đặc biệt trong cách API biểu diễn vì `getClassLoader()` trả `null`.

Chương Parent Delegation đã phân biệt **ClassLoader khởi xướng (initiating)** và **ClassLoader định nghĩa (defining)**. Ở đây chỉ cần giữ điểm phục vụ định danh: một class có một ClassLoader định nghĩa, và chính ClassLoader đó mới tham gia vào quy tắc định danh kiểu khi chạy.

### Ranh giới của quy tắc định danh này

Quy tắc `tên nhị phân + ClassLoader định nghĩa` ở trên là mô hình tư duy chính cho **class/interface có tên thông thường** mà module này đang học. Một số kiểu đặc biệt khi chạy không được tạo theo đúng đường `ClassLoader#defineClass` đó:

```text
array class
→ JVM tạo tự động khi cần
→ nếu component là reference type, getClassLoader() phản ánh loader của component type
→ nếu component là primitive, getClassLoader() trả null theo bootstrap representation

primitive type / void
→ vẫn có Class object như int.class / void.class
→ không có ClassLoader theo nghĩa ordinary class loading
```

Không cần đào sâu việc nạp array/primitive ở đây; ghi chú này chỉ giúp tránh hiểu quá rộng rằng **mọi** `Class<?>` đều được một ClassLoader tùy chỉnh gọi `defineClass` trực tiếp.
