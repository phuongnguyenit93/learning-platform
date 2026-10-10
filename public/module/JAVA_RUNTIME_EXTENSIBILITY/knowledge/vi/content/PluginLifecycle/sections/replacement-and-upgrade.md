Replacement/upgrade an toàn thường cần **prepare → switch → retire** thay vì stop cũ trước rồi hy vọng mới start được.

```text
discover candidate
→ validate compatibility
→ initialize new plugin
→ health check
→ atomically switch registry/reference
→ drain old plugin
→ stop old plugin
```

Nếu new plugin fail trước switch, host vẫn giữ old provider.

Rollback sau khi đã switch khó hơn nếu request đã tạo side effect với version mới. Vì vậy plugin lifecycle chỉ giải quyết runtime object transition; domain/data migration có thể cần strategy riêng.

Versioned registry hoặc immutable snapshot giúp request đang chạy giữ consistent provider reference trong lúc replacement xảy ra.

Một architecture không hỗ trợ rollback nên nói rõ thay vì giả vờ “reload” luôn reversible.
