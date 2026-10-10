`ServiceLoader` không định nghĩa vòng đời plugin. Nếu plugin giữ tài nguyên hoặc có hành vi startup/shutdown, host phải tự thiết kế lifecycle model.

Một model đơn giản:

```text
DISCOVERED
→ VALIDATED
→ INITIALIZED
→ ACTIVE
→ STOPPING
→ STOPPED
```

Không phải plugin nào cũng cần đủ các trạng thái này. Stateless provider có thể chỉ cần discovery → use.

Mô hình trạng thái hữu ích khi:

- initialization có thể fail;
- activation cần tài nguyên;
- plugin nhận request concurrent;
- replacement/upgrade cần drain traffic;
- cleanup phải bảo đảm chạy.

Lifecycle nên thuộc host orchestration, còn plugin cung cấp hook/capability cần thiết qua contract.
