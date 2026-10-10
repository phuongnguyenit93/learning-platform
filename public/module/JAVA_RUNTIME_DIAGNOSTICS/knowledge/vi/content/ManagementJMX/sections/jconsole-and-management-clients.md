**JConsole** là công cụ GUI theo dõi/quản lý đi kèm JDK. Nó kết nối qua JMX tới JVM local hoặc remote và hiển thị:

- memory;
- threads;
- classes;
- VM summary;
- MBeans.

JConsole hữu ích để khám phá giao diện quản lý và điều tra nhanh. Oracle lưu ý JConsole chạy local cũng tiêu tốn tài nguyên trên cùng host, nên môi trường production thường ưu tiên theo dõi từ xa để tách chi phí của UI khỏi JVM đích.

Ngoài JConsole, các client khác có thể dùng:

- JMC qua JMX cho dữ liệu quản lý;
- client Java tùy chỉnh với `JMXConnector`/`MBeanServerConnection`;
- tích hợp monitoring đọc các MXBean attribute.

UI của công cụ không thay đổi ngữ nghĩa dữ liệu. Cần hiểu MXBean/ObjectName phía dưới để tránh diễn giải metric sai.
