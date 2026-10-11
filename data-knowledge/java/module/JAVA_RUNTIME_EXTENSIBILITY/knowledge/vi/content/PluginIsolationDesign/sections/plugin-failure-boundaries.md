Một plugin lỗi không nên mặc định làm toàn host chuyển sang trạng thái không xác định.

Failure boundary nên phân loại ít nhất:

```text
discovery/config failure
→ provider không load được

activation failure
→ provider load được nhưng không start được

request failure
→ một thao tác của plugin thất bại

fatal integrity failure
→ contract/invariant host bị phá, có thể cần fail host
```

Host có thể wrap invocation:

```java
try {
    exporter.export(report);
} catch (PluginException ex) {
    metrics.pluginFailure(exporter.getClass().getName());
    throw ex;
}
```

Nhưng catch exception không tạo isolation kỳ diệu. Plugin vẫn có thể làm deadlock thread, dùng cạn memory hoặc làm hỏng shared mutable state.

Khi failure containment cần mạnh hơn mức JVM boundary cung cấp, process isolation có thể là lựa chọn đúng hơn.
