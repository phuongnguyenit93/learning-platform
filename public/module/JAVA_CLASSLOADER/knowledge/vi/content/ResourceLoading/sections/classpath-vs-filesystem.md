Code sau chỉ đúng trong một số deployment:

```java
URL url = loader.getResource("config/plugins.yml");
Path path = Path.of(url.toURI());
```

Nếu URL là `file:`, conversion có thể hợp lệ. Nhưng resource đóng gói trong JAR có thể có URL dạng:

```text
jar:file:/app/app.jar!/config/plugins.yml
```

và JDK runtime resource có thể dùng protocol khác như `jrt:`.

Vì vậy:

```text
classpath resource
≠
filesystem file
```

Nếu chỉ cần đọc resource, ưu tiên API stream:

```java
try (InputStream input =
             loader.getResourceAsStream("config/plugins.yml")) {
    ...
}
```

Nếu thật sự cần một `Path` để thư viện khác xử lý, ứng dụng phải quyết định chiến lược riêng: copy resource ra file tạm, mount filesystem phù hợp, hoặc yêu cầu config nằm ngoài classpath.
