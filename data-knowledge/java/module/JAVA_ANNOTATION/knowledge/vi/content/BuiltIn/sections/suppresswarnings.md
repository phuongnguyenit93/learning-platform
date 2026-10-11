`@SuppressWarnings` yêu cầu trình biên dịch bỏ qua những nhóm cảnh báo cụ thể trong phạm vi được gắn Annotation:

```java
@SuppressWarnings("unchecked")
List<String> cast(Object value) {
    return (List<String>) value;
}
```

Điểm quan trọng là việc bỏ qua cảnh báo **không làm thao tác trở nên an toàn kiểu**. Nó chỉ nói rằng lập trình viên đã xem cảnh báo và chấp nhận rủi ro tại vị trí đó.

Thực hành tốt:

```text
cảnh báo xuất hiện
→ hiểu nguyên nhân
→ sửa mã nguồn nếu có thể
→ chỉ bỏ qua cảnh báo khi quy tắc thực sự đảm bảo an toàn
→ đặt phạm vi bỏ qua cảnh báo ở mức nhỏ nhất
```

Không nên đặt:

```java
@SuppressWarnings({
    "unchecked",
    "deprecation",
    "removal",
    "preview"
})
class EntireModule {
}
```

chỉ để “quá trình build sạch cảnh báo”. Phạm vi quá rộng như vậy có thể che luôn những cảnh báo mới thuộc các nhóm đã bị bỏ qua, kể cả khi chúng xuất hiện ở phần mã nguồn hoàn toàn khác trong class.

Không nên dùng một chuỗi như `"all"` rồi giả định mọi trình biên dịch Java đều hiểu nó. Tập khóa ngoài các khóa chuẩn phụ thuộc vào trình biên dịch; ví dụ `javac` có các nhóm lint riêng và không coi `"all"` là một khóa `@SuppressWarnings` dùng để bật/tắt toàn bộ cảnh báo.

Java Language Specification yêu cầu trình biên dịch nhận biết ít nhất bốn khóa cảnh báo chuẩn:

- `"unchecked"`;
- `"deprecation"`;
- `"removal"`;
- `"preview"`.

Trình biên dịch có thể hỗ trợ thêm khóa riêng, ví dụ `javac` có những nhóm cảnh báo lint như `"rawtypes"`. Vì vậy không nên coi mọi chuỗi khóa cảnh báo đều là một tập chuẩn cố định do `@SuppressWarnings` tự định nghĩa.
