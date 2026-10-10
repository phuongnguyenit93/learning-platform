Lớp cục bộ hoặc lớp vô danh chỉ có thể sử dụng một biến cục bộ từ phạm vi bên ngoài khi biến đó là `final` hoặc **effectively final** — nghĩa là sau khi được gán giá trị, nó không bị gán lại.

```java
int limit = 10;
Runnable r = new Runnable() {
    public void run() {
        System.out.println(limit);
    }
};
```

Biến cục bộ được các lớp này **capture theo giá trị**. Nếu giá trị đó là một tham chiếu, giá trị tham chiếu được capture vẫn trỏ tới cùng đối tượng; Java không tạo một bản sao sâu của đối tượng và cũng không cho lớp cục bộ/lớp vô danh chia sẻ một “ô biến cục bộ” có thể bị gán lại sau đó.

Chương tiếp theo nhìn vào lớp cha gốc chung của các lớp Java thông thường: `java.lang.Object`.
