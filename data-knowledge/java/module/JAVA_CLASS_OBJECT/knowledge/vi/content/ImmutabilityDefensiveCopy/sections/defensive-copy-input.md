Nếu hàm khởi tạo nhận một đối tượng có thể thay đổi và giữ trực tiếp tham chiếu, bên gọi vẫn có thể thay đổi trạng thái nội bộ sau khi quá trình khởi tạo hoàn tất.

```java
this.tags = new ArrayList<>(tags);
```

Sao chép phòng vệ ở đầu vào tách quyền sở hữu của bản chụp trạng thái khỏi tập hợp do bên gọi giữ:

```java
List<String> source = new ArrayList<>();
BankAccountSnapshot snapshot = new BankAccountSnapshot("A-01", source);

source.add("VIP");
System.out.println(snapshot.tags()); // []
```

Với đầu vào bất biến như `String`, không cần sao chép chỉ để “cho chắc”.
