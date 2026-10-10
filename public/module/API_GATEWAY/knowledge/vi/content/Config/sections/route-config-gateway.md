Trong Spring Cloud Gateway, ngoài cách cấu hình bằng file `.yml` (Declarative), bạn có thể định nghĩa các Route bằng **Code Java (Programmatic)**. Đây là cách tiếp cận linh hoạt khi bạn cần logic kiểm tra điều kiện phức tạp trước khi điều hướng.

### 1. RouterFunction (Spring WebFlux)
Đây là một phần của Spring WebFlux cơ bản, dùng để định nghĩa các API Endpoints theo phong cách Functional Programming thay vì dùng `@RestController`.

* **Mục đích:** Xử lý request tại chỗ (giống Controller) thay vì điều hướng (proxy) sang service khác.
* **Ví dụ:** Viết một API ngay tại Gateway để trả về lời chào hoặc kiểm tra nhanh trạng thái hệ thống.

```java
  @Configuration
  public class LocalRouteConfig {
      @Bean
      public RouterFunction<ServerResponse> helloRoute() {
          return RouterFunctions.route()
              .GET("/hello-gateway", request -> 
                  ServerResponse.ok().bodyValue("Hello from Gateway Local!"))
              .build();
      }
  }
```

### 2. GatewayRouterFunction (Spring Cloud Gateway)
Đây là "vũ khí" chính của Gateway từ phiên bản **Spring Cloud Gateway 4.x**. Nó kết hợp sức mạnh của WebFlux RouterFunction nhưng bổ sung các tính năng đặc thù như Filters và Load Balancer.

* **Mục đích:** Định nghĩa logic điều hướng (Routing) sang Microservices khác bằng Code.
* **Ưu điểm:** Có thể dùng Java Stream, `if-else`, hoặc truy vấn Database/Redis để quyết định Route.

```java
  import static org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions.route;
  import static org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions.http;
  import static org.springframework.cloud.gateway.server.mvc.predicate.GatewayRequestPredicates.path;

  @Configuration
  public class GatewayRoutes {
      @Bean
      public RouterFunction<ServerResponse> orderServiceRoute() {
          return route("order-service")
              .route(path("/api/v1/orders/**"), http("lb://order-service"))
              .before(request -> {
                  // Thêm logic xử lý trước khi forward (ví dụ: Logging, Auth)
                  return request;
              })
              .build();
      }
  }
```

### 3. So sánh: Cấu hình .yml vs. Code Java

| Đặc điểm | Cấu hình .yml (Declarative) | Cấu hình Java Code (Programmatic) |
| :--- | :--- | :--- |
| **Độ khó** | Dễ, trực quan, dễ đọc. | Đòi hỏi kỹ năng Functional Programming. |
| **Linh hoạt** | Thấp (chỉ cấu hình tĩnh). | Rất cao (xử lý logic động). |
| **Hot Reload** | Tuyệt vời (qua Config Server). | Khó (thường phải build và deploy lại). |
| **Phù hợp** | Route cơ bản, cố định. | Route có logic phức tạp, bảo mật đặc thù. |

### 4. Lời khuyên cho dự án java-learning
Vì bạn đang sử dụng **Config Server**, hãy ưu tiên dùng file **.yml**.

* **Tại sao?** Khi dùng Java Code, mỗi lần thêm Route bạn phải thực hiện quy trình: Sửa Code -> Commit -> Build -> Deploy. Với `.yml`, bạn chỉ cần sửa file text trên repo và gọi `/refresh`, giúp đạt trạng thái **Zero Downtime**.
* **Khi nào dùng Code?** Chỉ sử dụng khi bạn có những logic "quái dị" mà YAML không diễn tả được (ví dụ: A/B Testing chia tải dựa trên ID người dùng thực tế trong Database).
