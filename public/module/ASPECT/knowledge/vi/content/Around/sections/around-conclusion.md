`@Around` không chỉ là "before + after trong một method". Nó là advice có thể điều khiển chính invocation.

Mental model an toàn:

```text
proceed()
→ tiếp tục call chain

không proceed()
→ chain dừng tại advice hiện tại
```
