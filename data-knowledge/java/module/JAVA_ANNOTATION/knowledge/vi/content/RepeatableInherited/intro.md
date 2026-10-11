# Annotation lặp lại và kế thừa

Hai Meta-Annotation `@Repeatable` và `@Inherited` không chỉ thay đổi cú pháp khai báo. Chúng làm thay đổi **cách siêu dữ liệu được biểu diễn và tra cứu**.

Đây là nơi dễ xảy ra hiểu nhầm nhất:

```text
Annotation xuất hiện trong mã nguồn
≠
mọi API Reflection đều trả về nó theo cùng một cách
```

Chương này tập trung vào ngữ nghĩa tra cứu cần thiết để dùng Annotation lặp lại và kế thừa đúng cách.
