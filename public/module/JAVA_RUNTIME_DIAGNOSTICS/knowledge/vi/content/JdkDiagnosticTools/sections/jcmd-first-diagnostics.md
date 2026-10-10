`jcmd` là command-line interface chung để gửi **diagnostic commands** tới một JVM đang chạy. Với JDK hiện đại, Oracle khuyến nghị ưu tiên `jcmd` thay cho các utility cũ như `jstack`, `jmap` và `jinfo` khi `jcmd` có command tương đương.

Quy trình cơ bản:

```bash
# Liệt kê JVM
jcmd -l

# Xem command nào JVM mục tiêu hỗ trợ
jcmd 12345 help

# Xem cú pháp/tác động của một lệnh cụ thể
jcmd 12345 help Thread.print

# Một số câu hỏi phổ biến
jcmd 12345 VM.version
jcmd 12345 VM.command_line
jcmd 12345 VM.flags
jcmd 12345 VM.system_properties
jcmd 12345 GC.heap_info
jcmd 12345 Thread.print -l
```

Danh sách lệnh có thể phụ thuộc JVM/build/version, vì vậy `jcmd <pid> help` trên **target thật** đáng tin cậy hơn việc nhớ một danh sách cố định.

`jcmd` cũng là điểm vào cho nhiều dữ liệu chẩn đoán quan trọng:

```bash
# Class histogram
jcmd 12345 GC.class_histogram

# Heap dump HPROF
jcmd 12345 GC.heap_dump /diagnostics/heap.hprof

# Thread dump truyền thống cho platform threads
jcmd 12345 Thread.print -l

# Thread dump có hỗ trợ virtual threads trong Java 21
jcmd 12345 Thread.dump_to_file -format=json /diagnostics/threads.json
```

Điểm cần lưu ý là “một công cụ” không có nghĩa “mọi lệnh đều nhẹ”. Oracle đánh dấu `VM.flags` là low impact, `Thread.print` là medium impact phụ thuộc số thread, còn `GC.class_histogram` và `GC.heap_dump` có thể high impact phụ thuộc kích thước/nội dung heap.

Vì vậy cách dùng đúng là:

```text
câu hỏi chẩn đoán
    ↓
jcmd <pid> help
    ↓
chọn command có đủ bằng chứng
    ↓
đọc mức tác động + chuẩn bị đầu ra
    ↓
thu thập
```

`jcmd` là giao diện điều khiển thuận tiện; nó không thay thế việc hiểu dữ liệu mà mỗi lệnh tạo ra.
