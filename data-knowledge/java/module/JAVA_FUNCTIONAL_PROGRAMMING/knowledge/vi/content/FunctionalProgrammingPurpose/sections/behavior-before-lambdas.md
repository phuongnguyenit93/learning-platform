Trước khi có lambda, Java vẫn truyền được hành vi bằng cách tạo lớp vô danh triển khai một giao diện:

```java
Comparator<String> byLength = new Comparator<String>() {
    @Override
    public int compare(String left, String right) {
        return Integer.compare(left.length(), right.length());
    }
};
```

Cách này hợp lệ vì đối tượng vô danh có kiểu Java bình thường và phương thức `compare` chứa hành vi cần truyền. Điểm bất tiện là cú pháp khá dài: tạo đối tượng, ghi đè phương thức, lặp lại kiểu tham số rồi mới tới phần logic thật sự.

Lambda không phát minh ra việc truyền hành vi. Nó cung cấp cú pháp ngắn gọn hơn khi kiểu đích là một giao diện hàm:

```java
Comparator<String> byLength =
        (left, right) -> Integer.compare(left.length(), right.length());
```

Vì vậy không nên hiểu lambda là một "phương thức không tên" tồn tại độc lập với hệ kiểu Java. Lambda vẫn cần một giao diện hàm làm kiểu đích.
