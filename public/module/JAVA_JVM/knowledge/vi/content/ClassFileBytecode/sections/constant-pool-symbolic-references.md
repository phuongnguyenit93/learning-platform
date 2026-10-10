Constant pool là bảng dữ liệu trung tâm của class file. Ngoài literal constant, nó chứa symbolic information về class, field, method, name-and-type, method handle, invokedynamic entry và nhiều loại khác.

JVM instruction không cần nhúng trực tiếp memory address của method/field. Thay vào đó, instruction có thể tham chiếu một entry trong constant pool:

```text
invokevirtual #12
              ↓
CONSTANT_Methodref
              ↓
class + name + descriptor
```

Nhờ symbolic reference, class file không cần biết object layout hoặc địa chỉ machine code tại compile time. Resolution ở runtime sẽ nối symbolic identity với runtime entity phù hợp.

Đây là cầu nối quan trọng giữa biểu diễn class file và runtime linking.
