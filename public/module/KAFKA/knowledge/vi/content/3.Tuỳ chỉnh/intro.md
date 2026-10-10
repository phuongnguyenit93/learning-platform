## Hướng dẫn config trong dự án Spring Boot Kafka
Danh sách các thuộc tính có thể tham khảo tại web :
* Đối với Spring boot:  https://docs.spring.io/spring-boot/appendix/application-properties/index.html
* Đối với Kafka:  https://kafka.apache.org/41/configuration/
* Spring Kafka Reference : https://docs.spring.io/spring-kafka/reference/

### 🧠 Tổng quan nhanh

`spring.kafka.*` được chia thành **6 nhóm cấu hình chính**:

- `spring.kafka.bootstrap-servers`
- `spring.kafka.consumer.*`
- `spring.kafka.producer.*`
- `spring.kafka.listener.*`
- `spring.kafka.admin.*`
- `spring.kafka.properties.*` *(pass thẳng xuống Kafka gốc)*

---

### 1️⃣ Bootstrap Server (Bắt buộc)

```properties
spring.kafka.bootstrap-servers=localhost:9092
```
👉 Danh sách Kafka broker để client connect lần đầu.

📌 Có thể khai báo nhiều broker để tăng tính sẵn sàng:

```properties
spring.kafka.bootstrap-servers=host1:9092,host2:9092,host3:9092
```

### 2️⃣ Consumer Configuration (`spring.kafka.consumer.*`)

Dùng cho **Kafka Consumer** / `@KafkaListener`.

#### 🔹 Ví dụ cơ bản

```properties
spring.kafka.consumer.group-id=order-group
spring.kafka.consumer.auto-offset-reset=earliest
spring.kafka.consumer.enable-auto-commit=false
spring.kafka.consumer.key-deserializer=org.apache.kafka.common.serialization.StringDeserializer
spring.kafka.consumer.value-deserializer=org.apache.kafka.common.serialization.StringDeserializer
```

#### 🔑 Tham số quan trọng (Consumer)

| Key | Ý nghĩa |
|----|--------|
| `group-id` | Consumer group |
| `auto-offset-reset` | `earliest` / `latest` |
| `enable-auto-commit` | Có tự động commit offset hay không |
| `max-poll-records` | Số message mỗi lần poll |

---

### 3️⃣ Producer Configuration (`spring.kafka.producer.*`)

Dùng cho **KafkaTemplate** / **Kafka Producer**.

#### 🔹 Ví dụ cơ bản

```properties
spring.kafka.producer.acks=all
spring.kafka.producer.retries=3
spring.kafka.producer.key-serializer=org.apache.kafka.common.serialization.StringSerializer
spring.kafka.producer.value-serializer=org.apache.kafka.common.serialization.StringSerializer
```

#### 🔑 Tham số hay dùng (Producer)

| Key | Ý nghĩa |
|----|--------|
| `acks` | `all` / `1` / `0` |
| `retries` | Số lần retry khi send fail |
| `linger-ms` | Thời gian delay để gom batch |
| `batch-size` | Kích thước batch |

### 4️⃣ Listener (`spring.kafka.listener.*`)
**(Spring Kafka layer – CỰC KỲ QUAN TRỌNG)**

```properties
spring.kafka.listener.concurrency=3
spring.kafka.listener.ack-mode=manual | manual_immediate | record | batch
spring.kafka.listener.poll-timeout=3000
spring.kafka.listener.auto-startup=true
spring.kafka.listener.missing-topics-fatal=false
```

#### 🔑 Tham số quan trọng

| Property | Ý nghĩa |
|--------|--------|
| `concurrency` | Số thread consumer trong **1 instance** |
| `ack-mode` | Khi nào commit offset |
| `poll-timeout` | Thời gian chờ poll |
| `auto-startup` | Có tự start listener khi app start hay không |
| `missing-topics-fatal` | Topic chưa tồn tại có làm crash app không |

---

🔥 **`ack-mode` + `enable-auto-commit` = combo dễ bug nhất**  
👉 Nếu không hiểu rõ cơ chế commit offset → **rất dễ mất hoặc duplicate message**.

---

### 5️⃣ Admin (`spring.kafka.admin.*`)
*(Ít dùng nhưng cần biết)*

```properties
spring.kafka.admin.auto-create=true
spring.kafka.admin.fail-fast=false
```

👉 Thường dùng khi:

- Auto create topic
- Check broker khi application startup

---

### 6️⃣ `properties.*` (Kafka gốc – *“escape hatch”*)

Dùng khi **Spring Kafka chưa support** property bạn cần.

```properties
spring.kafka.properties.security.protocol=SASL_PLAINTEXT
spring.kafka.properties.sasl.mechanism=PLAIN
spring.kafka.properties.sasl.jaas.config=...
```

📌 Pass **trực tiếp xuống Kafka client** (Producer / Consumer / Admin).

---

### 🧨 TOP CONFIG “DỄ CHẾT PROD”

⚠️ **Nhớ kỹ mấy cái này:**

- ❌ `enable-auto-commit=true` + xử lý message lâu
- ❌ `max-poll-interval-ms` quá nhỏ
- ❌ `concurrency` > số **partition**
- ❌ Không set `group-id`
- ❌ Không set `acks=all` cho data quan trọng
