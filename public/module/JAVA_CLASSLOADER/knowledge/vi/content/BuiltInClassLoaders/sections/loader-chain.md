Ta có thể quan sát chuỗi từ một class của ứng dụng:

```java
public class LoaderChainDemo {
    public static void main(String[] args) {
        ClassLoader loader = LoaderChainDemo.class.getClassLoader();

        while (loader != null) {
            System.out.println(loader);
            loader = loader.getParent();
        }

        System.out.println("<bootstrap represented by null>");
    }
}
```

Kết quả quan sát thường có dạng:

```text
Application/System loader
Platform loader
<bootstrap represented by null>
```

Đừng đọc chuỗi này như cây kế thừa của object Java. Nó là **quan hệ parent dùng cho delegation**.

```text
application loader
getParent()
→ platform loader

platform loader
getParent()
→ null
→ bootstrap boundary
```

Một bảng định hướng:

| Loader | Trách nhiệm điển hình | API quan sát |
| --- | --- | --- |
| Bootstrap | Core runtime classes | `SomeCoreClass.class.getClassLoader() == null` |
| Platform | Platform modules/classes | `ClassLoader.getPlatformClassLoader()` |
| Application/System | Application classpath/module-path | `ClassLoader.getSystemClassLoader()` |

Điểm quan trọng là một yêu cầu nạp class từ application loader không có nghĩa application loader sẽ tự định nghĩa class đó. Nó thường **delegate lên parent trước**. Chương tiếp theo giải thích chính xác vì sao chuỗi này hoạt động theo hướng đó.
