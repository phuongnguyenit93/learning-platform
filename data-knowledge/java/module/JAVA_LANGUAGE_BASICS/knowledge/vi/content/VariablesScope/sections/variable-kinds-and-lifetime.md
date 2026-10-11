Những loại biến thường gặp:

```text
biến cục bộ
→ khai báo trong khối/phương thức

tham số
→ nhận giá trị khi phương thức/constructor được gọi

trường instance
→ trạng thái của từng đối tượng

trường static
→ trạng thái gắn với lớp
```

Biến cục bộ/tham số tồn tại theo frame thực thi/ngữ cảnh của lời gọi. Trường tồn tại như một phần trạng thái của đối tượng/lớp.

Đừng đồng nhất vòng đời của một **biến tham chiếu** với vòng đời của đối tượng mà nó trỏ tới. Đối tượng có thể vẫn còn được tham chiếu từ nơi khác sau khi biến cục bộ ra khỏi phạm vi.

### Khai báo, khởi tạo và gán giá trị

Ba khái niệm này liên quan nhưng không giống nhau:

```java
int count;      // khai báo
count = 10;     // lần gán đầu tiên / khởi tạo theo nghĩa sử dụng
count = 20;     // gán lại

int size = 5;   // khai báo + biểu thức khởi tạo
```

Với trường, quá trình khởi tạo đối tượng/lớp cung cấp giá trị mặc định trước khi logic constructor chạy. Với biến cục bộ, trình biên dịch yêu cầu chương trình chứng minh rằng giá trị đã được gán trước khi đọc.

### Giá trị mặc định của trường khác biến cục bộ

```java
class Sample {
    int count;       // 0
    boolean active;  // false
    User user;       // null

    void run() {
        int local;
        // System.out.println(local); // lỗi biên dịch: chưa được gán chắc chắn
    }
}
```

Giá trị mặc định là một phần của quá trình khởi tạo trạng thái đối tượng/lớp. Nó **không** áp dụng như một quyền đọc tự động cho biến cục bộ và cũng không phải lý do để bỏ qua việc khởi tạo trạng thái có ý nghĩa nghiệp vụ.

### `var` vẫn là kiểu tĩnh

Từ Java 10, biến cục bộ có biểu thức khởi tạo có thể dùng `var` để trình biên dịch **suy ra kiểu tĩnh**:

```java
var count = 10;             // int
var name = "Java";          // String
var user = new User("A");   // User
```

`var` không biến Java thành ngôn ngữ kiểu động và không có nghĩa biến “không có kiểu”. Sau khi trình biên dịch suy ra kiểu, biến vẫn tuân theo kiểu đó:

```java
var value = "Java";
// value = 10; // không biên dịch: value có kiểu tĩnh String
```

Trình biên dịch cần biểu thức khởi tạo có đủ thông tin để suy ra kiểu:

```java
// var x;        // không được: không có biểu thức khởi tạo
// var y = null; // không được: không có kiểu cụ thể để suy ra
```

`var` chủ yếu là cú pháp cho **suy luận kiểu của biến cục bộ**. Nó không thay thế kiểu ở trường, kiểu trả về hoặc tham số phương thức thông thường:

```java
class Sample {
    // var field;            // không hợp lệ
    // var create() { }      // không hợp lệ
    // void use(var value) { } // tham số phương thức thông thường không hợp lệ
}
```

Quy tắc thực tế: dùng `var` khi biểu thức khởi tạo làm kiểu đủ rõ và tên biến diễn đạt ý định tốt; giữ kiểu tường minh khi suy luận khiến người đọc phải đoán.

### Phạm vi khác vòng đời

```java
User saved;
{
    User local = new User("A");
    saved = local;
}
// tên local đã ra khỏi phạm vi,
// nhưng object vẫn còn được tham chiếu qua saved
```

Phạm vi trả lời **tên có thể được nhắc tới ở đâu trong mã nguồn**. Vòng đời/khả năng còn được tham chiếu trả lời **trạng thái/đối tượng còn tồn tại hoặc còn được truy cập tới lúc nào**. Không nên dùng hai khái niệm này thay thế nhau.
