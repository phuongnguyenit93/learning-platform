### KHÁI NIỆM

**Định danh (identity)** trả lời câu hỏi:

> Hai biến tham chiếu có đang trỏ tới đúng cùng một đối tượng hay không?

**Bằng nhau về mặt logic (logical equality)** trả lời một câu hỏi khác:

> Hai đối tượng khác nhau có nên được xem là cùng một giá trị hoặc cùng một thực thể theo quy tắc nghiệp vụ hay không?

Java dùng hai cơ chế khác nhau:

```text
==
→ với tham chiếu: kiểm tra định danh

equals(...)
→ phương thức có thể ghi đè để định nghĩa phép bằng nhau về mặt logic
```

### VÌ SAO PHẢI PHÂN BIỆT?

Nếu không phân biệt hai khái niệm này, ta dễ viết mã nguồn đúng cú pháp nhưng sai ý nghĩa nghiệp vụ.

Ví dụ hai đối tượng sau là **hai đối tượng riêng biệt, có định danh khác nhau**, nhưng có thể đại diện cho cùng một `UserId`:

```java
UserId a = new UserId("U-100");
UserId b = new UserId("U-100");
```

Ta có hai câu hỏi độc lập:

```text
a và b có phải đúng cùng đối tượng không?
→ định danh

a và b có đại diện cùng mã người dùng không?
→ bằng nhau về mặt logic
```

Các cấu trúc dữ liệu như `HashSet`, `HashMap` hoặc `TreeSet` không thể tự đoán nghiệp vụ của bạn muốn hiểu chữ “giống nhau” theo nghĩa nào. Chúng dựa vào các quy ước mà kiểu dữ liệu hoặc đoạn mã sử dụng cung cấp.

### THAM CHIẾU, ĐỐI TƯỢNG VÀ GIÁ TRỊ

Một biến tham chiếu không phải chính đối tượng. Có thể hình dung:

```text
UserId a ───────┐
                ├──> UserId("U-100")
UserId same ────┘

UserId b ──────────> UserId("U-100")
```

`a` và `same` có cùng định danh vì cùng trỏ tới một đối tượng. `a` và `b` có định danh khác nhau dù dữ liệu giống nhau.
