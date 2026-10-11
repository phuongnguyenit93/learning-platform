# Object – lớp gốc chung

`java.lang.Object` là lớp gốc của hệ phân cấp lớp thông thường trong Java. Mọi lớp khác `Object` đều trực tiếp hoặc gián tiếp kế thừa từ `Object`, nhờ đó các đối tượng có một nhóm hành vi nền chung. Hiểu `Object` cũng giải thích vì sao `Object` có thể đóng vai trò kiểu tham chiếu rất rộng trước khi đi sâu vào các quy ước `equals`/`hashCode` ở mô-đun riêng. Các cách triển khai mặc định từ `Object` không phải lúc nào cũng phù hợp với ngữ nghĩa của miền nghiệp vụ, nên một số lớp cần định nghĩa lại hành vi phù hợp với hợp đồng tương ứng.
