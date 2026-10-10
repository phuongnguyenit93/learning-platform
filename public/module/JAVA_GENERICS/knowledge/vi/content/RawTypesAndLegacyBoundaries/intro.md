# Kiểu thô (Raw Types) và ranh giới mã cũ

Bạn có thể gặp cả hai dạng mã sau:

```java
List<String> names = new ArrayList<>();
List names = new ArrayList();
```

Dòng thứ hai nhìn giống như “Generics nhưng bỏ phần `<String>`”. Tại sao Java vẫn cho phép?

Lý do là **Generics được thêm vào Java sau khi rất nhiều mã Java đã tồn tại**. Java cần một con đường để mã generic mới vẫn gọi được thư viện hoặc mã cũ chưa có type argument.

`List`, `Box`, `Map`... khi dùng tên generic type mà **không có type argument** được gọi là **raw type**.

Raw type là một **cầu tương thích với mã cũ (legacy code)**. Đổi lại, compiler mất bớt khả năng bảo vệ an toàn kiểu. Vì vậy mục tiêu của chương này không phải “học cách dùng raw type”, mà là **nhận ra nó, hiểu rủi ro và cô lập nó khỏi mã mới**.
