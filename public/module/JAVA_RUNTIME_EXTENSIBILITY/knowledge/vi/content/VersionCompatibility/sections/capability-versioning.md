Capability versioning tập trung vào **provider làm được gì**, thay vì chỉ “provider phiên bản bao nhiêu”.

Ví dụ:

```java
enum ExportCapability {
    PDF_A,
    STREAMING,
    ENCRYPTION
}

Set<ExportCapability> capabilities();
```

Host có thể yêu cầu:

```text
request cần PDF_A + ENCRYPTION
→ filter provider theo capability
→ rồi mới apply version/priority policy
```

Cách này hữu ích khi feature được rollout không hoàn toàn trùng với release number hoặc nhiều provider implement subset khác nhau.

Không nên version từng method một cách quá chi tiết. Mục tiêu là model những compatibility dimension host thực sự cần quyết định.

Kết hợp capability + contract version giúp migration mềm hơn: provider cũ có thể tiếp tục phục vụ request cơ bản, còn request cần feature mới được route tới provider mới.
