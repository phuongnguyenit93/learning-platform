Controller:

```text
AroundAdviceController#transform()
```

Endpoint:

```text
GET /aop/around/transform
```

Target trả:

```text
original-result
```

Nhưng caller nhận:

```text
original-result|transformed-by-around
```

Experiment này chứng minh advice có thể thay đổi contract mà caller quan sát được. Trong code thật, capability này cần dùng rất thận trọng.
