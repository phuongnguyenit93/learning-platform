Mã Java hiện đại thường ưu tiên `java.nio.file.Path` để biểu diễn đường dẫn và `java.nio.file.Files` để thực hiện các thao tác trên hệ thống tệp.

```text
kiểu cũ
File
  └─ đường dẫn + thao tác trong cùng một kiểu

NIO.2 hiện đại
Path
  └─ biểu diễn đường dẫn

Files
  └─ thao tác trên hệ thống tệp
```

`File` vẫn xuất hiện nhiều trong API cũ và thư viện hiện hữu, nên cần biết cách làm việc với nó. Java cho phép chuyển đổi trực tiếp qua lại:

```java
java.io.File legacy = new java.io.File("data/report.txt");
java.nio.file.Path path = legacy.toPath();
java.io.File back = path.toFile();
```

`Path`/`Files` thường cung cấp thao tác rõ hơn và ngoại lệ giàu thông tin hơn:

```java
java.nio.file.Path path = java.nio.file.Path.of("data", "report.txt");

try {
    java.nio.file.Files.delete(path);
} catch (java.nio.file.NoSuchFileException e) {
    System.out.println("File không tồn tại: " + e.getFile());
}
```

Ranh giới này dẫn tự nhiên sang chương kế tiếp: sau khi hiểu `File` là mô hình đường dẫn kiểu cũ và thấy giới hạn của nó, ta sẽ học `Path`/`Files` như mô hình hiện đại để biểu diễn đường dẫn và thao tác với hệ thống tệp.
