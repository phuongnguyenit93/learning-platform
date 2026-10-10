Để tích hợp OpenRewrite vào một dự án Multi-module, bạn cần thực hiện cấu hình tại dự án gốc (Root) để có thể quản lý việc tái cấu trúc (refactor) cho tất cả các module con cùng một lúc.

## 1. Cấu hình file build.gradle (Root Project)

Bạn thêm plugin và khai báo các Recipe (công thức) cần thiết trong khối `subprojects` để áp dụng cho toàn bộ hệ thống.

```gradle
	plugins {
	    id("org.openrewrite.rewrite") version "6.23.0"
	}

	rewrite {
	    // Chỉ định các Recipe bạn muốn áp dụng (ví dụ: Cleanup và Migrate Java 17)
	    activeRecipe("org.openrewrite.java.cleanup.Cleanup", "org.openrewrite.java.migrate.Java17")
	}

	subprojects {
	    apply plugin: "org.openrewrite.rewrite"

	    dependencies {
	        // Khai báo các thư viện chứa Recipe (chỉ dùng trong quá trình rewrite)
	        rewrite("org.openrewrite.recipe:rewrite-migrate-java:2.20.0")
	        rewrite("org.openrewrite.recipe:rewrite-static-analysis:1.15.0")
	        rewrite("org.openrewrite.recipe:rewrite-spring:5.18.0")
	    }
	}
```

## 2. Các lệnh thực thi quan trọng

OpenRewrite cung cấp 2 tác vụ chính mà bạn sẽ thường xuyên sử dụng:

* **Kiểm tra thử (`rewriteDryRun`):** Quét mã nguồn và tạo file báo cáo (thường ở `build/reports/rewrite/rewrite.patch`). Lệnh này **không** thay đổi code, giúp bạn xem trước các sửa đổi.
```bash
  ./gradlew rewriteDryRun
 ```

* **Áp dụng thay đổi (`rewriteRun`):** Thực sự ghi đè và thay đổi file mã nguồn của bạn dựa trên các Recipe đã chọn.
```bash
  ./gradlew rewriteRun
```

## 3. Các Recipe hữu ích cho Backend Java/Spring

Bạn có thể thay đổi danh sách trong `activeRecipe` tùy theo nhu cầu hiện tại của dự án:

| Tên Recipe | Mục đích | Thư viện cần thêm |
| :--- | :--- | :--- |
| **UpgradeSpringBoot_3_2** | Nâng cấp toàn bộ dự án lên Spring Boot 3.2. | `rewrite-spring` |
| **JUnit4to5Migration** | Chuyển đổi Unit Test từ JUnit 4 sang 5. | `rewrite-testing` |
| **CommonStaticAnalysis** | Tự động sửa các lỗi code smell (SonarLint). | `rewrite-static-analysis` |

## 4. Lưu ý khi dùng cho dự án Multi-module

* **Chạy cho module cụ thể:** Nếu bạn chỉ muốn chạy cho một module (ví dụ: `api-gateway`), hãy dùng lệnh:
```bash
  ./gradlew :api-gateway:rewriteRun
```
* **Git Check:** Luôn đảm bảo bạn đã **commit** hoặc **stash** code trước khi chạy `rewriteRun`. Điều này giúp bạn dễ dàng so sánh (diff) và kiểm tra lại các thay đổi tự động của công cụ.
