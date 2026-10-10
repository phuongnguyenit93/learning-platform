Có thể tạo mảng với độ dài rồi gán từng phần tử:

```java
int[] values = new int[3];
values[0] = 10;
```

hoặc dùng biểu thức khởi tạo:

```java
int[] values = {10, 20, 30};
```

Mảng kiểu nguyên thủy nhận giá trị mặc định của kiểu nguyên thủy; mảng tham chiếu nhận `null` cho từng phần tử ban đầu.

Truy cập chỉ số ngoài `[0, length)` gây `ArrayIndexOutOfBoundsException` ở thời điểm chạy.

### Giá trị mặc định của phần tử

```java
int[] numbers = new int[2];       // [0, 0]
boolean[] flags = new boolean[2]; // [false, false]
String[] names = new String[2];   // [null, null]
```

Điều này khác definite assignment của biến cục bộ: đối tượng mảng đã được khởi tạo và từng ô phần tử có giá trị mặc định.

Với mảng tham chiếu, giá trị `null` của phần tử vẫn có hệ quả khi truy cập qua tham chiếu:

```java
User[] users = new User[1];
users[0].getName(); // NullPointerException vì users[0] == null
```

### Duyệt mảng

```java
for (int i = 0; i < values.length; i++) {
    System.out.println(values[i]);
}

for (int value : values) {
    System.out.println(value);
}
```

Dùng chỉ số khi cần vị trí hoặc thay đổi phần tử. Enhanced-for phù hợp khi chỉ cần đọc từng phần tử.

Biến của enhanced-for là một biến cục bộ nhận giá trị phần tử ở mỗi lượt. Gán lại biến đó **không thay phần tử trong mảng**:

```java
int[] numbers = {1, 2, 3};
for (int number : numbers) {
    number = 0; // chỉ đổi biến cục bộ number
}
```

Muốn thay ô phần tử của mảng, dùng chỉ số hoặc API phù hợp.

Enhanced-for cũng áp dụng cho `Iterable` như các Collection sẽ học sau này. Quy tắc về biến vòng lặp vẫn giống nhau: gán lại biến cục bộ không thay thế phần tử đang nằm trong cấu trúc chứa.

```java
List<String> items = List.of("A", "B"); // xem trước API Collection
for (String item : items) {
    item = item.toLowerCase(); // không thay phần tử trong items
}
```

### So sánh và sao chép

`==` trên mảng so tính đồng nhất của tham chiếu, không so từng phần tử. Khi cần so nội dung hoặc sao chép, dùng tiện ích phù hợp như `Arrays.equals`, `Arrays.copyOf` hoặc `System.arraycopy` tùy trường hợp.

### Sao chép mảng không đồng nghĩa sao chép sâu phần tử

Với mảng kiểu nguyên thủy, sao chép phần tử tạo ra giá trị nguyên thủy độc lập ở mảng mới. Với mảng tham chiếu, mảng mới nhận **bản sao của từng giá trị tham chiếu**:

```java
User[] original = {
    new User("A")
};

User[] copied = Arrays.copyOf(original, original.length);

copied[0].setName("B");
System.out.println(original[0].getName()); // B
```

Ở đây `original` và `copied` là hai đối tượng mảng khác nhau, nhưng phần tử chỉ số `0` của cả hai chứa tham chiếu tới cùng đối tượng `User`:

```text
mảng original            mảng copied
┌─────────────┐            ┌─────────────┐
│ ref R ──────┼──────┐     │ ref R ──────┼──────┐
└─────────────┘      │     └─────────────┘      │
                     └────────→ User ←───────────┘
```

Vì vậy `Arrays.copyOf`/`System.arraycopy` sao chép nội dung mảng theo giá trị phần tử; chúng không tự sao chép sâu đối tượng được các phần tử tham chiếu tới. Chiến lược sao chép nông/sâu của đối tượng được đào sâu ở mô-đun `class-object`.
