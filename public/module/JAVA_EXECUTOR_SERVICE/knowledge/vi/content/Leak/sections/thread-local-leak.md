ThreadLocal value gắn với worker có thể sống lâu nếu worker sống lâu.

Do đó:

```text
set context
→ try
→ work
→ finally remove/restore
```

là lifecycle rule, không chỉ coding style.
