Generic type nên biểu diễn **một quan hệ kiểu có ý nghĩa**, không chỉ thay `Object` một cách máy móc.

Ví dụ repository đơn giản:

```java
interface Repository<ID, T> {
    T findById(ID id);
    void save(T value);
}
```

Chữ ký cho bên gọi biết:

- kiểu id là gì;
- repository đọc/trả về kiểu gì;
- giá trị nào được phép ghi.

Một số nguyên tắc thực tế:

- dùng type parameter khi nhiều member cần chia sẻ cùng một danh tính kiểu;
- tránh trả `Object` nếu API thật sự biết kiểu;
- giữ số type parameter vừa đủ để chữ ký còn đọc được;
- nếu bên gọi chỉ cần “một kiểu chưa biết nào đó”, wildcard thường hợp lý hơn việc thêm một type parameter không tạo quan hệ nào;
- đừng dùng raw type để “cho ngắn”.

Có thể tổng hợp lựa chọn thiết kế bằng bảng sau:

| Nhu cầu của API | Công cụ thường phù hợp |
| --- | --- |
| Nhiều vị trí phải giữ **cùng một kiểu** | Type parameter có tên như `<T>` |
| `T` phải cung cấp một khả năng tối thiểu | Bounded type parameter, ví dụ `<T extends Number>` |
| Chỉ cần chấp nhận “một kiểu nào đó” và không cần đặt tên lại | Wildcard `?` |
| Chủ yếu đọc `T` từ tham số | `? extends T` |
| Chủ yếu ghi `T` vào tham số | `? super T` |
| Cần vừa đọc vừa ghi chính xác cùng `T` | Kiểu chính xác như `List<T>` thường rõ hơn wildcard |
| Phải đi qua API cũ dùng raw type | Cô lập ở một ranh giới nhỏ, kiểm tra/chuyển đổi rồi quay lại mã có kiểu rõ ràng |
| Cần tạo object hoặc biết class thật ở runtime | Nhận factory, `Class<T>` hoặc một type token phù hợp từ bên gọi |

Điểm quan trọng là không chọn cú pháp theo độ “nâng cao”. Hãy bắt đầu từ **quan hệ kiểu mà API thực sự cần biểu diễn**, sau đó dùng cơ chế đơn giản nhất vẫn giữ được quan hệ đó và an toàn kiểu.

### Tổng kết mô hình Generics

```text
Generic Type / Method
→ tạo quan hệ kiểu tái sử dụng được

Bounds
→ yêu cầu khả năng tối thiểu

Invariance
→ ngăn suy diễn subtype không an toàn giữa các parameterized type; đặc biệt quan trọng với cấu trúc mutable

Wildcards + PECS
→ mở rộng ranh giới API theo hướng đọc/ghi

Raw Types
→ lối tương thích với mã cũ nhưng dễ làm suy yếu an toàn kiểu

Type Erasure
→ nền triển khai và nguồn của nhiều giới hạn
```

Khi thiết kế API generic, mục tiêu không phải dùng cú pháp phức tạp nhất mà là **diễn đạt đúng quan hệ kiểu để compiler bảo vệ bên gọi và phần triển khai càng sớm càng tốt**.
