Một lớp tham gia **tuần tự hóa đối tượng nguyên bản của Java (`Java Object Serialization`)** thường triển khai giao diện đánh dấu (marker interface) `Serializable`:

~~~java
final class Note implements Serializable {
    private static final long serialVersionUID = 1L;

    private final String title;
    private final String body;

    Note(String title, String body) {
        this.title = title;
        this.body = body;
    }
}
~~~

`Serializable` không khai báo phương thức nào. Nó là **giao diện đánh dấu (marker interface)**: lớp dùng nó để nói với cơ chế tuần tự hóa rằng các **đối tượng (instance)** của lớp này được phép tham gia quá trình.

Ghi đối tượng:

~~~java
Path file = Files.createTempFile("note-", ".ser");

try (
        OutputStream out = Files.newOutputStream(file);
        ObjectOutputStream objectOut = new ObjectOutputStream(out)
) {
    objectOut.writeObject(
            new Note("I/O", "Java serialization demo")
    );
}
~~~

Đọc lại:

~~~java
try (
        InputStream in = Files.newInputStream(file);
        ObjectInputStream objectIn = new ObjectInputStream(in)
) {
    Note note = (Note) objectIn.readObject();
}
~~~

Mô hình cần tránh là:

~~~text
đối tượng
→ bản đồ trường kiểu JSON
~~~

mà gần hơn với:

~~~text
đồ thị đối tượng Java
→ ObjectOutputStream ghi giao thức tuần tự hóa của Java
→ luồng byte chứa mô tả kiểu/lớp + trạng thái + tham chiếu trong đồ thị
→ ObjectInputStream đọc giao thức
→ JVM dựng lại đồ thị đối tượng Java
~~~

Vì vậy dãy byte kết quả không nên được xem là một quy ước dễ đọc, độc lập ngôn ngữ hoặc tự động ổn định lâu dài.
