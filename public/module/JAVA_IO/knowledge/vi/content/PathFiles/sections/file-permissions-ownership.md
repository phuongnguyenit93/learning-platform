`BasicFileAttributes` cung cấp tập siêu dữ liệu cơ bản có tính đa nền tảng tương đối cao. Nhưng hệ thống tệp còn có những nhóm siêu dữ liệu chuyên biệt. NIO.2 mô hình các nhóm này bằng **góc nhìn thuộc tính tệp (file attribute view)**: một “góc nhìn” cho biết provider hỗ trợ đọc/ghi loại siêu dữ liệu nào.

```text
BasicFileAttributeView
→ kích thước, thời gian, loại tệp, fileKey...

PosixFileAttributeView
→ chủ sở hữu, nhóm và quyền rwx trên hệ thống tệp kiểu POSIX

DosFileAttributeView
→ readonly, hidden, archive, system trên provider hỗ trợ DOS attributes

FileOwnerAttributeView
→ chủ sở hữu dưới dạng UserPrincipal
```

Không nên suy ra khả năng hỗ trợ chỉ từ tên hệ điều hành. Hãy hỏi hệ thống tệp/provider đang thực sự giữ tệp:

```java
FileStore store = Files.getFileStore(note);

boolean posixSupported =
        store.supportsFileAttributeView(PosixFileAttributeView.class);
boolean dosSupported =
        store.supportsFileAttributeView(DosFileAttributeView.class);
```

Nếu POSIX view được hỗ trợ, mã có thể đọc tập `PosixFilePermission`:

```java
if (Files.getFileStore(note)
        .supportsFileAttributeView(PosixFileAttributeView.class)) {

    Set<PosixFilePermission> permissions =
            Files.getPosixFilePermissions(note);

    System.out.println(permissions);
}
```

Các quyền POSIX biểu diễn `READ`, `WRITE`, `EXECUTE` cho **chủ sở hữu / nhóm / người khác**. Khi thật sự cần thay đổi quyền, `Files.setPosixFilePermissions(...)` ghi một tập quyền mới, nhưng thao tác có thể thất bại vì provider không hỗ trợ hoặc tiến trình không có quyền cần thiết. Vì vậy quyền truy cập là sự kết hợp giữa khả năng của hệ thống tệp và quyền của tiến trình, không chỉ là một enum trong Java.

Chủ sở hữu được biểu diễn bằng `UserPrincipal`:

```java
UserPrincipal owner = Files.getOwner(note);
System.out.println(owner.getName());
```

`Files.setOwner(...)` hoặc một `FileOwnerAttributeView` có thể thay chủ sở hữu khi provider hỗ trợ và hệ điều hành cho phép. Đổi chủ sở hữu thường là thao tác nhạy cảm về quyền hệ thống, nên mã không nên giả định bên gọi hiện tại luôn được phép thực hiện.

Symbolic link tiếp tục là một ranh giới quan trọng. Nếu gọi API thuộc tính theo mặc định, nhiều thao tác làm việc với đích của link. Khi muốn xem siêu dữ liệu của **chính mục link**, hãy dùng API/view chấp nhận `LinkOption.NOFOLLOW_LINKS`, ví dụ:

```java
PosixFileAttributeView linkView = Files.getFileAttributeView(
        linkPath,
        PosixFileAttributeView.class,
        LinkOption.NOFOLLOW_LINKS);
```

View có thể là `null` nếu provider không hỗ trợ loại thuộc tính đó. Mã đa nền tảng nên có phương án dự phòng hoặc yêu cầu khả năng rõ ràng thay vì giả định mọi hệ thống tệp đều có ngữ nghĩa POSIX, DOS, ACL hoặc chủ sở hữu giống nhau.
