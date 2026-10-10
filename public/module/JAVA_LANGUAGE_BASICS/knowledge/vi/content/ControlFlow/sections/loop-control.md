Các vòng lặp chính:

```text
for
→ phù hợp khi có phần khởi tạo/điều kiện/cập nhật rõ

while
→ lặp khi điều kiện còn đúng

do-while
→ thân vòng lặp chạy ít nhất một lần
```

`break` không nhãn thoát khỏi vòng lặp hoặc câu lệnh `switch` gần nhất có thể nhận nó; `continue` bỏ phần còn lại của lượt lặp hiện tại và chuyển sang lần tiếp theo của vòng lặp.

`break/continue` có nhãn tồn tại nhưng thường chỉ nên dùng khi nó làm ý định của vòng lặp lồng nhau rõ hơn; nếu luồng quá khó theo dõi, tách thành phương thức nhỏ có thể tốt hơn.

### Chọn vòng lặp theo mục đích

```java
for (int i = 0; i < 3; i++) {
    System.out.println(i);
} // số lần lặp và biến đếm rõ ràng

int count = 3;
while (count > 0) {
    count--;
} // lặp theo điều kiện

do {
    attempt();
} while (retry); // body phải chạy ít nhất một lần
```

### Vòng lặp thực sự chạy theo thứ tự nào?

`for` cổ điển có chu kỳ thực thi:

```text
khởi tạo             // một lần
      ↓
điều kiện
 ├─ false → thoát vòng lặp
 └─ true
      ↓
thân vòng lặp
      ↓
cập nhật
      ↓
quay lại điều kiện
```

Vì vậy `continue` trong `for` cổ điển chuyển luồng tới **biểu thức cập nhật**, rồi mới kiểm tra điều kiện lần tiếp theo:

```java
for (int i = 0; i < 3; i++) {
    if (i == 1) {
        continue; // vẫn chạy i++ trước lần kiểm tra tiếp theo
    }
    System.out.println(i);
}
```

`while` kiểm tra điều kiện trước thân vòng lặp, nên thân có thể chạy 0 lần. `do-while` chạy thân trước rồi mới kiểm tra điều kiện, nên thân chạy ít nhất 1 lần.

Mô hình này quan trọng hơn việc chỉ nhớ cú pháp, vì nó giải thích `continue`, điều kiện kết thúc và tác dụng phụ trong phần điều kiện/cập nhật.

### Definite assignment qua nhánh và vòng lặp

Khi có nhiều đường thực thi, trình biên dịch phải chứng minh biến cục bộ đã được gán trên **mọi đường có thể đi tới điểm đọc**:

```java
int x;
if (condition) {
    x = 1;
} else {
    x = 2;
}
System.out.println(x); // hợp lệ: mọi nhánh đều gán x
```

Ngược lại, thân `while` có thể không chạy lần nào:

```java
int x;
while (condition) {
    x = 1;
}
// System.out.println(x); // không bảo đảm x đã được gán
```

Đây là phần mở rộng của quy tắc definite assignment đã học ở chương Biến, phạm vi và vòng đời.
