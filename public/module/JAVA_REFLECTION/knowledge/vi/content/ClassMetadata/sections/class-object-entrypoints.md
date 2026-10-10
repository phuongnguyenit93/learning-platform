Reflection thường bắt đầu từ một `Class<?>`. `Class` không phải mã nguồn của class; nó là đối tượng lúc chạy đại diện cho một kiểu mà JVM đã biết.

Có ba cửa vào thường gặp:

~~~java
// 1. Biết kiểu ngay trong mã nguồn
Class<PaymentService> a = PaymentService.class;

// 2. Có sẵn đối tượng nhưng không biết kiểu cụ thể tại thời điểm biên dịch
Object service = new PaymentService("stripe");
Class<?> b = service.getClass();

// 3. Chỉ có tên nhị phân của class lúc chạy
Class<?> c = Class.forName("com.example.PaymentService");
~~~

Class literal phù hợp khi mã nguồn đã tham chiếu trực tiếp tới kiểu. `Object.getClass()` phù hợp với framework nhận một đối tượng bất kỳ và muốn kiểm tra class cụ thể lúc chạy. `Class.forName(...)` phù hợp với tình huống plugin/cấu hình nơi tên class chỉ có lúc chạy.

`Class<T>` còn mang thông tin kiểu tại thời điểm biên dịch. `Class<PaymentService>` nói rằng đối tượng `Class` này đại diện cho `PaymentService`. `Class<?>` nghĩa là “đây là một đối tượng `Class` hợp lệ nhưng mã hiện tại chưa biết kiểu cụ thể là gì”. Framework thường làm việc với `Class<?>` vì chính việc chưa biết kiểu cụ thể là một phần của bài toán; sau đó nó kiểm tra siêu dữ liệu trước khi ép kiểu hoặc thao tác.

Primitive và mảng cũng có đối tượng `Class`:

~~~java
Class<Integer> primitive = int.class;
Class<String[]> array = String[].class;
~~~

`Class.forName(String)` mặc định **khởi tạo class** sau khi tìm/nạp nó, nên phần khởi tạo static có thể chạy. Overload `Class.forName(name, false, loader)` cho phép yêu cầu không khởi tạo ở bước đó. Chi tiết vòng đời và định danh class thuộc mô-đun ClassLoader; ở đây chỉ cần nhớ rằng lấy `Class` bằng tên có thể có tác dụng phụ khác với việc đơn giản dùng class literal.

Sau khi có Class<?>, ta mới đi sang các câu hỏi cụ thể:

~~~java
Class<?> type = PaymentService.class;

String name = type.getName();
Field[] fields = type.getDeclaredFields();
Method[] methods = type.getDeclaredMethods();
Constructor<?>[] constructors = type.getDeclaredConstructors();
~~~

Phần còn lại của chương **Mô hình kiểu lúc chạy với Class<?>** sẽ đào sâu câu hỏi “kiểu này là gì”; các chương Field/Method/Constructor sau đó xử lý từng loại thành phần.
