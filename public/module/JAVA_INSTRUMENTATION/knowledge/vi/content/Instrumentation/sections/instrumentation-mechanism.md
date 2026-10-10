Cơ chế cốt lõi không phải “sửa object đang sống”, mà là xử lý **class-file bytes**. ClassFileTransformer nhận metadata của class cùng mảng byte đại diện cho class file. Nó có thể:

1. trả về null để giữ nguyên bytes hiện tại;
2. trả về một mảng byte hợp lệ khác;
3. ném IllegalClassFormatException khi đầu vào không thể xử lý đúng.

Ở lần nạp đầu tiên, phép biến đổi xảy ra trước khi định nghĩa được cài đặt. Với class đã được nạp, redefine và retransform có thể kích hoạt quy trình thay đổi khác nhưng vẫn chịu giới hạn của JVM.

Ví dụ một timing agent về mặt ý tưởng sẽ biến:

~~~text
OrderService.placeOrder()
~~~

thành:

~~~text
ghi thời điểm bắt đầu
try
    chạy bytecode gốc
finally
    ghi thời lượng
~~~

Thư viện như ASM hoặc Byte Buddy có thể giúp tạo mảng byte mới, nhưng chúng **không phải Instrumentation API**. Instrumentation cung cấp vòng đời/hook; công cụ bytecode chỉ giúp hiện thực phép biến đổi.
