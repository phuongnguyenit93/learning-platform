Với mọi lớp khác `Object`, chuỗi hàm khởi tạo cuối cùng phải dẫn tới hàm khởi tạo của lớp cha; đi theo chuỗi kế thừa sẽ kết thúc ở `Object()`.

```text
this(...)
→ hàm khởi tạo khác cùng lớp
→ cuối cùng phải tới super(...)
```

Các lời gọi này phải tuân quy tắc đặc biệt của Java về vị trí trong chuỗi khởi tạo.

Với ví dụ trên, chuỗi gọi là:

```text
new SavingsAccount(...)
→ SavingsAccount(...)
→ super(id, balance)
→ BankAccount(id, balance)
→ Object()
```

Hiểu chuỗi này là nền tảng để đọc thứ tự khởi tạo ở các chương sau.

Trước đó, chương tiếp theo trả lời: **những thành viên nào mã bên ngoài hoặc lớp con được phép truy cập?**
