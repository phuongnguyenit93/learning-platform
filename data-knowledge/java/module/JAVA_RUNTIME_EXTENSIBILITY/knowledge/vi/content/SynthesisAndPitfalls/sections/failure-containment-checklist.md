Trước khi activate hoặc replace plugin, kiểm tra ít nhất:

```text
[ ] provider discovery context explicit?
[ ] service/capability compatibility đã validate?
[ ] ambiguity/priority policy rõ?
[ ] required provider thiếu thì fail thế nào?
[ ] initialization failure rollback resource nào?
[ ] plugin tạo thread/executor/socket/file nào?
[ ] ai sở hữu cleanup?
[ ] in-flight request được drain/cancel thế nào?
[ ] host/global cache có giữ plugin class/instance không?
[ ] context ClassLoader/ThreadLocal có reset không?
[ ] observability ghi plugin identity/version/cause chưa?
```

Checklist này không thay thế design, nhưng giúp biến “reload plugin” từ một từ mơ hồ thành một lifecycle có ownership cụ thể.

Failure containment nên được test bằng provider cố ý fail ở discovery, initialization, request và cleanup — không chỉ test happy path.
