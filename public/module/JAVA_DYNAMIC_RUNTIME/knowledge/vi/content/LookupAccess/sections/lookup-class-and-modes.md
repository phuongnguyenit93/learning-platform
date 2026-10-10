`lookupClass()` cho biết class đóng vai trò access context. `lookupModes()` mô tả những mode còn được phép. Java 21 có các mode `PUBLIC`, `PRIVATE`, `PROTECTED`, `PACKAGE`, `MODULE`, `UNCONDITIONAL` và `ORIGINAL`.

Hai mode ít gặp nhưng cần nhận diện:

- `ORIGINAL`: cho biết lookup bắt nguồn từ original lookup class (ví dụ `MethodHandles.lookup()` hoặc lookup do VM cấp cho bootstrap); mode này bị mất khi lookup được transform;
- `UNCONDITIONAL`: gắn với `publicLookup()` và cho phép public access tới các package được export vô điều kiện, không dựa trên readability của một module bên gọi cụ thể.

```java
MethodHandles.Lookup lookup = MethodHandles.lookup();

System.out.println(lookup.lookupClass());
System.out.println(lookup.lookupModes());
```

Quyền truy cập có thể **mất bớt** khi lookup được chuyển sang context khác. Vì vậy đừng chỉ hỏi “class đích có private không?”, mà cần hỏi:

```text
lookup được tạo ở đâu?
→ lookup class là ai?
→ lookup còn mode nào?
→ module/package relationship ra sao?
```

Module boundary rất quan trọng từ Java 9 trở đi. Một member có thể public nhưng package/module vẫn không open/readable theo cách lookup cần.
