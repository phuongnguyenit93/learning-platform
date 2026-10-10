Đây là phần **đào sâu nguyên nhân của lỗi an toàn kiểu không thể được compiler kiểm tra đầy đủ**. Người mới nên nhận diện được raw type và hiểu cảnh báo unchecked trước; chi tiết heap pollution quan trọng hơn khi tích hợp API cũ, generic varargs hoặc gỡ lỗi kiểu xuất hiện xa nguồn gây ra.

Heap pollution xảy ra khi một biến của parameterized type tham chiếu tới object không phù hợp với parameterized type đó.

Ví dụ qua raw type:

```java
List<String> names = new ArrayList<>();
List raw = names;
raw.add(123); // unchecked

String name = names.get(0); // ClassCastException tại phép ép kiểu compiler chèn
```

Điểm nguy hiểm là lỗi thường xuất hiện **xa điểm gây heap pollution**.

Heap pollution cũng có thể liên quan generic varargs hoặc phép ép kiểu unchecked. Module `language-basics → Varargs` sở hữu đầy đủ ngữ nghĩa của varargs; module Annotation sở hữu annotation liên quan. **Lý do sâu hơn liên quan lượng thông tin kiểu còn lại ở runtime** sẽ được giải thích ở chương Type Erasure. Ở đây chỉ cần nhớ: một thao tác unchecked có thể tạo ra trạng thái mà compiler không còn chứng minh đầy đủ được an toàn kiểu.
