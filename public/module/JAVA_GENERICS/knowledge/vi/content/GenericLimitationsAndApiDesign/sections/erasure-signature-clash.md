Không thể overload chỉ dựa vào generic arguments nếu các chữ ký sau erasure giống nhau:

```java
// void process(List<String> values) {}
// void process(List<Integer> values) {} // name clash sau erasure
```
