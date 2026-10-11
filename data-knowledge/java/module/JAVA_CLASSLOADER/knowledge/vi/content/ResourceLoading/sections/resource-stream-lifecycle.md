`getResourceAsStream` thuận tiện khi chỉ cần đọc bytes/text:

```java
try (InputStream input =
             loader.getResourceAsStream("config/plugins.yml")) {

    if (input == null) {
        throw new IllegalStateException("Missing config/plugins.yml");
    }

    byte[] bytes = input.readAllBytes();
    System.out.println(new String(bytes, StandardCharsets.UTF_8));
}
```

Ba rule:

```text
not found
→ có thể trả null

found
→ nhận InputStream

dùng xong
→ close bằng try-with-resources
```

Không nên giả định stream là `FileInputStream`. Resource có thể đến từ JAR hoặc protocol khác.

Với plugin loader có lifecycle ngắn, việc đóng stream và đóng loader/resource container khi thích hợp giúp tránh file handle/resource leak, đặc biệt trên Windows nơi open JAR/file handle có thể ảnh hưởng replace/delete artifact.
