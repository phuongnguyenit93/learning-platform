Một Java agent thường được đóng gói thành JAR riêng. JAR chứa:

- agent class có premain/agentmain;
- transformer và helper classes;
- manifest khai báo cách JVM tìm agent class;
- các dependency cần thiết, tùy chiến lược đóng gói.

Ví dụ cấu trúc:

~~~text
timing-agent.jar
├── META-INF/MANIFEST.MF
└── com/example/agent/
    ├── TimingAgent.class
    └── TimingTransformer.class
~~~

Agent JAR không tự động “được ứng dụng import”. JVM đọc manifest và nạp agent class theo vòng đời của java.lang.instrument. Vì agent nằm trong cùng tiến trình với ứng dụng, cách đóng gói cần đặc biệt chú ý xung đột phụ thuộc và khả năng nhìn thấy qua class loader.

Theo quy ước của package, các class trong agent JAR được system class loader nạp và thuộc unnamed module của loader đó. Nếu agent đặt helper qua Boot-Class-Path hoặc appendToBootstrapClassLoaderSearch(), helper lại chịu khả năng nhìn thấy của bootstrap class loader. Sự khác biệt này giải thích nhiều lỗi kiểu “agent class nhìn thấy helper nhưng class đã biến đổi không phân giải được helper”.
