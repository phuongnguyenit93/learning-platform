Enum có thể `implements` giao diện, giúp một tập hằng đóng vai trò các cách triển khai có hợp đồng rõ ràng. Phần này chỉ cần nhận biết khả năng đó; thiết kế giao diện được học sâu ở mô-đun Abstract Interface.

```java
interface FeePolicy {
    int feeFor(int amount);
}

enum FeeTier implements FeePolicy {
    STANDARD {
        public int feeFor(int amount) { return amount / 100; }
    },
    PREMIUM {
        public int feeFor(int amount) { return 0; }
    }
}
```

Điều này thường rõ hơn một `switch` lớn khi hành vi thật sự thuộc từng hằng.
