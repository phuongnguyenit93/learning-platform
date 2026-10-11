JVM Specification định nghĩa **class file format** như một hợp đồng nhị phân mà JVM phải hiểu. Một class file chứa thông tin như version, constant pool, access flags, field, method và attribute. Method có code thực thi sẽ mang `Code` attribute chứa bytecode và metadata cần thiết cho việc thực thi.

Điểm quan trọng là JVM không cần biết mã nguồn ban đầu có phải Java hay không. Miễn toolchain sinh ra biểu diễn class file hợp lệ, JVM có thể xử lý nó theo cùng hợp đồng.

Class file cũng không mô tả trực tiếp “object nằm ở offset nào trong RAM” hoặc “GC dùng thuật toán nào”. Nó mô tả **cấu trúc logic của chương trình và symbolic references**. Cách triển khai runtime mới quyết định biểu diễn vật lý và tối ưu.

Vì vậy, khi debug một vấn đề JVM, hãy hỏi trước:

```text
đây là hợp đồng của class file/JVMS?
hay là hành vi riêng của HotSpot?
```

Phân biệt này giúp tránh biến một chi tiết triển khai thành quy luật chung của Java.
