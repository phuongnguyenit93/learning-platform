Sao chép nông tạo đối tượng bên ngoài mới nhưng sao chép giá trị các trường như hiện có.

Với trường kiểu tham chiếu, tham chiếu được sao chép chứ đối tượng con không tự động được nhân bản. Giả sử `BankAccount` giữ một danh sách tag có thể thay đổi và hàm khởi tạo sao chép giữ nguyên tham chiếu tới danh sách đó:

```java
class BankAccount {
    private final String id;
    private final List<String> tags;

    BankAccount(String id, List<String> tags) {
        this.id = id;
        this.tags = tags;
    }

    BankAccount(BankAccount source) {
        this(source.id, source.tags); // sao chép nông: cùng tham chiếu tới danh sách
    }

    List<String> tags() {
        return tags;
    }
}

BankAccount original = new BankAccount("A-01", new ArrayList<>());
BankAccount copy = new BankAccount(original);

copy.tags().add("VIP");

System.out.println(original.tags()); // [VIP]
```

Hai đối tượng `BankAccount` có danh tính khác nhau nhưng vẫn cùng tham chiếu tới một danh sách có thể thay đổi. Vì vậy thay đổi thông qua `copy` vẫn được nhìn thấy từ `original`.
