`ClassFile` là một sequence có schema xác định. Các entry thường không chứa toàn bộ text lặp lại; nhiều thành phần tham chiếu qua index vào constant pool.

Ví dụ conceptual:

```text
method_info
  name_index ─────────┐
  descriptor_index ─┐│
                    ↓↓
              constant_pool
```

Method không phải abstract/native thường có `Code` attribute. `Code` chứa instruction bytes, max stack, local-variable capacity, exception table và nested attributes như line-number/debug metadata.

Từ góc nhìn người học, cấu trúc này giải thích vì sao tool như `javap -v` có thể hiển thị bytecode, constant pool, descriptor và attribute một cách có hệ thống.

Một cách quan sát trực tiếp:

```text
javac Demo.java
javap -c -v Demo
```

`javac` tạo class file; `javap` cho phép nhìn lại chính biểu diễn mà JVM sẽ đọc thay vì chỉ nhìn source.
