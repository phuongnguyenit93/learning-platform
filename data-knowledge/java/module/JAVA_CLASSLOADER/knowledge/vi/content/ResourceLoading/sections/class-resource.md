`Class#getResource(String)` có hai cách hiểu path.

Giả sử class:

```text
com/example/plugins/PaymentPlugin.class
```

và resources:

```text
com/example/plugins/plugin.properties
config/plugins.yml
```

### Không có dấu /

```java
URL url = PaymentPlugin.class.getResource("plugin.properties");
```

Path được hiểu **relative với package của class**:

```text
"plugin.properties"
→ com/example/plugins/plugin.properties
```

Điều này hữu ích khi resource đi sát một class/package.

### Có dấu / ở đầu

```java
URL url = PaymentPlugin.class.getResource("/config/plugins.yml");
```

Path được hiểu từ resource root:

```text
"/config/plugins.yml"
→ config/plugins.yml
```

Đây là rule rất đáng nhớ:

```text
Class.getResource("x")
→ package-relative

Class.getResource("/x")
→ absolute từ resource root của class/module
```

> **Nâng cao — JPMS boundary:** với class thuộc **named module**, dấu `/` không biến lookup thành một cách vượt qua ranh giới module. `Class.getResource` tìm resource trong module của chính class theo các quy tắc resource access của module; với non-`.class` resource, mức độ mở của package có thể quyết định resource có được truy cập hay không. Vì vậy cùng một path có thể hoạt động trên classpath phẳng nhưng trả `null` khi chuyển sang named module nếu package/resource không được expose phù hợp.

API trả `null` nếu không tìm thấy resource, nên code cần xử lý trường hợp này rõ ràng:

```java
URL url = PaymentPlugin.class.getResource("plugin.properties");
if (url == null) {
    throw new IllegalStateException("Missing plugin.properties");
}
```
