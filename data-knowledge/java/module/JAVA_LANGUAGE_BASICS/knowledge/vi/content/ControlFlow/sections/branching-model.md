`if/else` phù hợp khi điều kiện là một biểu thức boolean linh hoạt:

```java
if (score >= 90) {
    grade = "A";
} else if (score >= 80) {
    grade = "B";
}
```

`switch` phù hợp khi một giá trị chọn (selector) được đối chiếu với tập `case` rõ ràng. Với Java hiện đại, `switch` có thể là câu lệnh hoặc biểu thức.

Đừng chọn chỉ vì cú pháp ngắn hơn; hãy chọn cấu trúc làm mô hình quyết định dễ đọc nhất.

### `if/else`: điều kiện phải thực sự là boolean

Java không có cơ chế tự coi số hay tham chiếu là true/false:

```java
int count = 1;
// if (count) { } // không biên dịch được

if (count > 0) { }
```

Điều này làm điều kiện tường minh và giúp trình biên dịch kiểm tra kiểu.

### Câu lệnh `switch` và fall-through

`switch` dạng dấu `:` có thể fall-through nếu không `break`:

```java
switch (level) {
    case 1:
        enableBasic();
        break;
    case 2:
        enableAdvanced();
        break;
    default:
        disableAll();
}
```

Fall-through đôi khi có chủ ý, nhưng phải rất rõ. Dạng mũi tên hiện đại tránh fall-through ngoài ý muốn và phù hợp khi mỗi `case` độc lập.
