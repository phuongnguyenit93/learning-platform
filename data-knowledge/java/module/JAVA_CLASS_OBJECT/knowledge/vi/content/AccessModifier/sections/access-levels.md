Java có bốn mức chính cho thành viên:

```text
private
→ chỉ trong lớp khai báo

package-private
→ các kiểu trong cùng package

protected
→ package + một số quyền truy cập qua lớp con

public
→ mọi nơi có thể nhìn thấy kiểu/thành viên theo quy tắc module/package
```

Không có từ khóa `package-private`; đó là mức truy cập khi không ghi từ bổ nghĩa truy cập.
