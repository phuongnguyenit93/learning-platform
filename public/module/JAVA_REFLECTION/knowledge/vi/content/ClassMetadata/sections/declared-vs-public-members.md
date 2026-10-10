Đây là sự phân biệt quan trọng nhất trước khi đi vào Field, Method và Constructor.

Hai họ API có ý nghĩa khác nhau:

~~~text
getDeclaredXxx(...)
→ thành phần được khai báo trực tiếp bởi chính class này
→ có thể public/protected/package-private/private
→ không tự lấy thành phần được kế thừa

getXxx(...)
→ nhìn theo bề mặt API public
→ với field/method có thể gồm thành phần public được kế thừa
~~~

Ví dụ:

~~~java
class BaseService {
    public String serviceName() {
        return "base";
    }
}

class PaymentService extends BaseService {
    private int processedCount;

    private String internalStatus() { return "ok"; }
    public String pay(PaymentRequest request) { return "ok"; }
}
~~~

Về mặt khái niệm, kết quả là:

~~~text
PaymentService.class.getDeclaredMethod("internalStatus")
→ tìm thấy private method được khai báo tại PaymentService

PaymentService.class.getMethod("serviceName")
→ tìm thấy public method được kế thừa từ BaseService

PaymentService.class.getDeclaredMethod("serviceName")
→ NoSuchMethodException
~~~

Với field:

~~~text
getDeclaredFields() → field khai báo trực tiếp, mọi mức truy cập
getFields()         → public field của class + public field được kế thừa
~~~

Với method:

~~~text
getDeclaredMethods() → method khai báo trực tiếp, mọi mức truy cập
getMethods()         → public method của class + bề mặt public từ hệ phân cấp/interface
~~~

Một ngoại lệ quan trọng: `static` method của interface **không được kế thừa** bởi class triển khai hoặc subinterface. Vì vậy đừng đọc câu “public method từ hệ phân cấp interface” thành “mọi method hỗ trợ static trên interface cũng xuất hiện như method được kế thừa của class”. Static interface method thuộc chính interface khai báo nó.

Constructor là trường hợp khác vì constructor **không được kế thừa**:

~~~text
getDeclaredConstructors() → mọi constructor khai báo bởi class
getConstructors()         → chỉ public constructor của chính class
~~~

Các method khám phá trả về mảng không cam kết thứ tự phù hợp với mã nguồn. Framework không nên chọn “method đầu tiên” hoặc “constructor đầu tiên” rồi coi đó là hợp đồng. Hãy chọn bằng điều kiện rõ: tên, kiểu tham số, annotation, modifier hoặc quy tắc miền.

Chương tiếp theo áp dụng sự phân biệt này vào `Field`: **khi đã biết kiểu, ta tìm những field trạng thái nào và siêu dữ liệu nào mô tả chúng?** Việc đọc/ghi giá trị sẽ được thực hiện sau đó trong milestone **Thao tác động bằng siêu dữ liệu**.
