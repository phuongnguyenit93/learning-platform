Spring AOP proxy thường expose infrastructure interface:

```text
Advised
```

Qua đó có thể inspect:

```text
Advisor[]
```

Việc này hữu ích khi debug hoặc học architecture, nhưng application code thông thường không nên phụ thuộc sâu vào `Advised` để chạy business flow.
