NetworkInterface mô tả một network interface mà JVM nhìn thấy trên máy: Ethernet, Wi-Fi, loopback, virtual interface hoặc interface khác do hệ điều hành cung cấp.

Nó hữu ích khi ứng dụng cần:

- liệt kê địa chỉ local;
- chọn interface cho multicast;
- kiểm tra loopback/up/down;
- tránh giả định rằng một máy chỉ có đúng một IP.

Ví dụ:

~~~java
for (NetworkInterface nic :
        Collections.list(NetworkInterface.getNetworkInterfaces())) {

    System.out.println(nic.getName());

    for (InetAddress address : Collections.list(nic.getInetAddresses())) {
        System.out.println("  " + address.getHostAddress());
    }
}
~~~

Máy phát triển, container host và cloud server thường có nhiều interface. Vì vậy lấy “địa chỉ đầu tiên” rồi coi đó là định danh máy ổn định là một giả định yếu.

NetworkInterface thuộc Networking vì nó ảnh hưởng trực tiếp tới bind, multicast và việc chọn địa chỉ local. Nó không phải abstraction để mô hình hóa topology, route table hay service discovery ở cấp hạ tầng.
