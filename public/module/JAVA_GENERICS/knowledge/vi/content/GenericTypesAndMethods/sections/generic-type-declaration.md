Một lớp generic khai báo type parameter ngay sau tên lớp:

```java
final class Box<T> {
    private T value;

    void set(T value) {
        this.value = value;
    }

    T get() {
        return value;
    }
}
```

Khi sử dụng, một đối số kiểu cụ thể tạo ra một **kiểu được tham số hóa (parameterized type)**:

```java
Box<String> textBox = new Box<>();
Box<Integer> numberBox = new Box<>();
```

Kiểu generic không chỉ là `class`. `interface` cũng có thể khai báo type parameter:

```java
interface Repository<ID, T> {
    T findById(ID id);
    void save(T value);
}
```

Lớp triển khai có thể tiếp tục dùng tham số kiểu hoặc cố định chúng thành kiểu cụ thể:

```java
class User {}

final class UserRepository implements Repository<Long, User> {
    @Override
    public User findById(Long id) {
        return null;
    }

    @Override
    public void save(User value) {
    }
}
```

`ID` và `T` đều là type parameter của `Repository`. Một lớp triển khai khác cũng có thể tiếp tục giữ chúng generic thay vì cố định ngay thành `Long` và `User`.

Điểm quan trọng không phải cú pháp `<T>` tự nó, mà là **một quan hệ kiểu được sở hữu bởi khai báo và dùng nhất quán qua các thành viên**.
