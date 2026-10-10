Giả sử hai `@Around` Aspect cùng match target:

```text
Aspect A @Order(1)
Aspect B @Order(2)
```

Với precedence hiện tại, Aspect có order nhỏ hơn đứng ngoài call chain:

```text
A before
    B before
        target
    B after
A after
```

Điểm dễ nhầm là chiều đi ra đảo ngược chiều đi vào vì đây là nested invocation, không phải bốn callback độc lập chạy tuyến tính.

`@Order`/precedence phải rõ nếu correctness phụ thuộc thứ tự. Nếu hai advice cùng match nhưng không có precedence contract rõ ràng, **không nên lấy thứ tự log quan sát được trong một lần chạy làm guarantee**.
