Use initializer blocks because they make the lifecycle clearer, not simply because the language allows them.

```text
simple field initializer
→ clear default state

constructor/helper
→ validation and context-rich initialization

initializer block
→ only when it genuinely clarifies shared initialization
```

The next chapter combines these pieces into the exact initialization order.
