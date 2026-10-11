Application ClassLoader là loader thông thường dùng cho code ứng dụng trên classpath/module-path.

```java
public class ApplicationLoaderDemo {
    public static void main(String[] args) {
        ClassLoader system = ClassLoader.getSystemClassLoader();
        ClassLoader defining = ApplicationLoaderDemo.class.getClassLoader();

        System.out.println(system);
        System.out.println(defining);
        System.out.println(system == defining);
    }
}
```

Trong cách khởi chạy thông thường, class của project sẽ do system/application loader định nghĩa, nên phép so sánh cuối thường là `true`.

Tên “system ClassLoader” đến từ API `ClassLoader.getSystemClassLoader()`; trong JVM thông thường nó đóng vai application loader. Java cho phép cấu hình custom system loader, vì vậy code thư viện không nên suy ra quá nhiều chỉ từ concrete class name của loader.

Đối với ví dụ plugin xuyên suốt:

```text
Plugin API nằm trong ứng dụng
→ Application ClassLoader load

plugin implementation đóng gói cùng ứng dụng
→ Application ClassLoader cũng có thể load

plugin implementation ở nguồn riêng
→ chương CustomClassLoader sẽ dùng loader con
```
