Khi cùng một concern trải rộng trên nhiều module hoặc nhiều execution boundary, việc gọi helper thủ công dễ tạo duplicate code và phụ thuộc vào việc developer nhớ áp dụng đúng ở mọi nơi.

AOP đưa concern đó thành một đơn vị riêng và mô tả **nơi nào nó được áp dụng** thay vì chèn logic thủ công vào từng business method.
