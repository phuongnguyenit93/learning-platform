Effectively final không có nghĩa là bất biến.

```java
List<String> names = new ArrayList<>();

Consumer<String> addName = name -> names.add(name);
addName.accept("Lan");
addName.accept("Minh");
```

Biến cục bộ `names` không bị gán lại nên nó effectively final và có thể được bắt giữ. Tuy nhiên `ArrayList` vẫn có thể thay đổi, vì vậy lambda có thể gọi `add` để thay đổi nội dung đối tượng.

Trường hợp sau lại khác:

```java
List<String> names = new ArrayList<>();
Consumer<String> addName = name -> names.add(name);

// names = new ArrayList<>(); // sẽ làm mất trạng thái effectively final
```

Việc thay đổi đối tượng qua tham chiếu bị bắt giữ là hợp lệ về mặt ngôn ngữ, nhưng cũng là một điểm cần cân nhắc trong thiết kế. Sự thay đổi trạng thái ẩn bên trong hàm gọi lại hoặc chuỗi hành vi có thể khiến thứ tự thực thi và trạng thái dùng chung khó theo dõi. Khi thay đổi trạng thái là phần quan trọng của bài toán, nên làm rõ nơi sở hữu và thời điểm thay đổi thay vì cho rằng dùng lambda sẽ làm việc thay đổi trạng thái trở nên vô hại.
