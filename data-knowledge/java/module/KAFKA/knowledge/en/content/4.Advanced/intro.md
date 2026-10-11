# Các kiến thức nâng cao của Kafka
## Idempotent

### Định nghĩa 
Idempotent Producer là cơ chế giúp Kafka Producer **không gửi trùng message**, kể cả khi phải retry do:
- Network error
- Timeout
- Leader failover

👉 Gửi 1 lần hay retry 10 lần → **Broker chỉ ghi đúng 1 message**

---

### Vấn đề Kafka gặp phải (trước khi có idempotent)

Kafka khuyến khích retry để tránh mất message, nhưng retry có thể gây **duplicate**:

* Producer gửi message → Broker ghi OK  
* ACK bị mất (timeout / network)  
* Producer retry  
* Broker ghi **lần nữa** ❌

➡ Consumer đọc → xử lý **trùng dữ liệu**

---

## How It Works

Kafka gắn cho mỗi producer:

- **ProducerId (PID)** – duy nhất
- **Sequence Number** – tăng dần theo từng partition

Broker sẽ:
- Lưu sequence cuối cùng của `PID + partition`
- Bỏ qua message có sequence đã xử lý
- Reject message có sequence sai thứ tự

➡ Retry bao nhiêu lần cũng **không bị duplicate**

---

### Configuration

#### Kafka Producer

```properties
enable.idempotence=true
```

Spring Kafka

```properties
spring.kafka.producer.properties.enable.idempotence: true
```
### Enforced Configs

Khi bật `idempotence`, Kafka **tự động ép các config an toàn** để đảm bảo không mất tính idempotent:

| Config | Value |
|------|------|
| `acks` | `all` |
| `retries` | `> 0` |
| `max.in.flight.requests.per.connection` | `≤ 5` |

---

## Limitations

❌ **Không đảm bảo exactly-once end-to-end**

Idempotent Producer **chỉ đảm bảo**:
- Exactly-once giữa **Producer → Broker**

❌ **Không đảm bảo**:
- Consumer xử lý đúng 1 lần
- Database không bị ghi trùng

👉 Muốn end-to-end exactly-once → **Kafka Transactions**

---

## Comparison

| Mechanism | Deduplication | Scope |
|---------|---------------|-------|
| Normal Retry | ❌ | None |
| Idempotent Producer | ✅ | Producer → Broker |
| Kafka Transactions | ✅ | Producer → Broker → Consumer |

---

## Khi nào BẮT BUỘC nên dùng?

### Nên bật gần như mọi producer hiện đại, đặc biệt khi:
- Producer có retry
- Xử lý **tài chính / đơn hàng**
- Dữ liệu **không được phép trùng**

### Không bật chỉ khi:
- Dữ liệu chấp nhận duplicate
- Kafka < 0.11

---
## 🎯 Kafka Producer Retry – Chuẩn & An Toàn

## 1️⃣ Nguyên tắc VÀNG

> **Kafka Producer: retry ≠ duplicate**  
> Duplicate **chỉ xảy ra** khi retry mà **KHÔNG bật idempotent**

👉 Vì vậy:
- ✅ **Retry luôn nên bật**
- ✅ **Idempotent gần như luôn nên bật**

---

## 2️⃣ Cấu hình retry CHUẨN (Recommended)

### Kafka Client / Spring Kafka (99% trường hợp)

```properties
enable.idempotence=true
acks=all
retries=Integer.MAX_VALUE
delivery.timeout.ms=120000
linger.ms=5
batch.size=16384
```

Spring Boot
```yaml
spring:
  kafka:
    producer:
      acks: all
      retries: 2147483647
      properties:
        enable.idempotence: true
        delivery.timeout.ms: 120000

```

## 3️⃣ Giải thích từng config (ngắn gọn)

### 🔁 retries

- Cho phép retry gần như vô hạn
- Producer **chỉ fail khi**:
  - Vượt `delivery.timeout.ms`
  - Hoặc gặp lỗi **không thể recover**

📌 Retry **KHÔNG gây duplicate** nếu bật idempotent

---

### ⏱ delivery.timeout.ms (RẤT quan trọng)

- Tổng thời gian Kafka cho phép:

send → retry → retry → retry → fail
⛔ Nếu **KHÔNG set**:
- Retry nhiều
- Nhưng timeout sớm → **fail oan**

---

### ✅ acks=all

- Leader + toàn bộ ISR ghi xong mới ACK
- Chậm hơn một chút
- Nhưng **không mất dữ liệu**

📌 Kafka **bắt buộc `acks=all`** khi bật idempotent

---

### 🚦 max.in.flight.requests.per.connection

- Kafka tự set `≤ 5` khi `enable.idempotence=true`
- Đảm bảo:
- Thứ tự message
- Sequence number không bị lệch

⚠️ **Không override** giá trị này

---

## 4️⃣ Flow retry (thực tế)
```
Producer gửi msg #10 (seq=10)
    ↓
Network timeout
    ↓
Retry gửi lại msg #10 (seq=10)
    ↓
Broker thấy seq=10 đã xử lý
    ↓
❌ Bỏ qua
    ↓
ACK OK
```

➡➡️ Không duplicate  
➡️ Consumer chỉ thấy **1 message**

---

## 5️⃣ Các lỗi config PHỔ BIẾN (⚠️ cực nguy hiểm)

### ❌ Retry nhưng KHÔNG bật idempotent

💥 **Duplicate chắc chắn xảy ra**

---

### ❌ Retry thấp + timeout thấp

➡️ Dễ **mất message** khi leader fail

---

### ❌ Tắt retry vì “sợ trùng”

➡️ **MẤT DỮ LIỆU** còn nguy hiểm hơn duplicate

---

## 6️⃣ Tóm tắt nhanh

### ✅ LUÔN bật
```properties
enable.idempotence=true
acks=all
retries=Integer.MAX_VALUE
delivery.timeout.ms >= 120000
```
❌ KHÔNG làm

* Tắt retry
* Retry mà không bật idempotent
* Override max.in.flight.requests.per.connection bừa bãi

---
## Exactly-once, At-least-once, At-most-once

Mặc định thì : Kafka = at-least-once

### 1️⃣ Tổng quan nhanh (Bảng nhớ não 🧠)

| Thuật ngữ | Ý nghĩa thực tế | Có mất message? | Có xử lý trùng? | Độ khó |
|---------|----------------|-----------------|-----------------|--------|
| **At-most-once** *(mostly-once)* | Xử lý tối đa 1 lần | ✅ Có thể | ❌ Không | Dễ |
| **At-least-once** | Xử lý ít nhất 1 lần | ❌ Không | ✅ Có thể | Trung bình |
| **Exactly-once** | Xử lý chính xác 1 lần | ❌ Không | ❌ Không | Khó  |

📌 **Kafka mặc định = At-least-once**

---

### 2️⃣ At-most-once (Mostly-once) là gì?

#### 👉 Ý nghĩa
Message **có thể bị mất**, nhưng **không bao giờ xử lý trùng**.

#### 👉 Khi nào xảy ra?
- Commit offset **trước khi xử lý**
- Consumer crash **sau commit**
- Kafka nghĩ: *“xong rồi”*
- Nhưng code **chưa xử lý xong**

#### 👉 Flow
```text
poll()
commit offset
process message 💥 crash
```
➡️ **Message biến mất vĩnh viễn**

#### 👉 Dùng khi nào?
- Log
- Metric
- Tracking không quan trọng
- “Mất 1–2 record không sao”

---

### 3️⃣ At-least-once (Mặc định Kafka)

#### 👉 Ý nghĩa
Message **không mất**, nhưng **có thể xử lý trùng**.

#### 👉 Flow
```text
poll()
process message
commit offset
```
💥 Nếu crash trước commit

➡️ Kafka gửi lại message  
➡️ Message xử lý **2 lần**

#### 👉 Ví dụ thực tế
- Insert DB → insert trùng
- Gửi email → gửi **2 lần** 

#### 👉 Cách xử lý
- Idempotent
- Deduplicate
- Check business key

---

### 4️⃣ Exactly-once là gì?

#### 👉 Ý nghĩa
Dù crash ở đâu → message **chỉ được xử lý đúng 1 lần**.

#### 👉 Vấn đề cốt lõi
Kafka **quản lý được**:
- Offset
- Producer

❌ **KHÔNG quản lý được**:
- Database
- API
- Hệ thống khác

---

### 5️⃣ Exactly-once trong Kafka nghĩa là gì ?

⚠️ **Rất quan trọng**:

> **Kafka Exactly-once ≠ End-to-End Exactly-once**

Kafka **chỉ đảm bảo**:
- Consume → Process → Produce sang **topic khác** = đúng 1 lần

📌 **KHÔNG đảm bảo**:
- Ghi DB
- Call REST
- Gửi email

---

### 6️⃣ Kafka làm Exactly-once bằng cách nào?

#### 🔹 Kafka Transaction
- `transactional.id`
- Commit offset + produce message trong **1 transaction**

```text
enable.idempotence=true
transactional.id=order-tx-1
```

```text
beginTransaction
consume message
produce new message
sendOffsetsToTransaction
commitTransaction
```

➡️ Hoặc **thành công hết**  
➡️ Hoặc **rollback hết**

---

### 7️⃣ Nhưng với DB thì sao? 😬

❌ **Không có “magic”**

Kafka **không thể rollback DB** cho bạn.

➡️ Muốn *end-to-end exactly-once*, bạn phải tự xử lý.

### ✅ Pattern thường dùng
- Idempotent consumer
- Transactional Outbox
- Dedup table
- Unique business key

---

### 8️⃣ Mapping sang Spring Kafka

🔹 At-most-once

```yaml
enable-auto-commit: true
```

🔹 At-least-once
```yaml
enable-auto-commit: false
ack-mode: RECORD

```

🔹 Exactly-once (Kafka → Kafka)
```yaml
spring.kafka.producer.transaction-id-prefix: tx-
spring.kafka.listener.ack-mode: MANUAL

```

---

### 9️⃣ Kết luận để nhớ lâu 🧠

- 🔸 **At-most-once**: nhanh – có thể mất
- 🔸 **At-least-once**: an toàn – có thể trùng
- 🔸 **Exactly-once**: rất khó – chỉ *Kafka → Kafka* là “chuẩn”

---
## Kafka Transaction

# 🚀 Kafka Transactions là gì?

**Kafka Transactions** là cơ chế giúp Kafka đảm bảo:

> Message được xử lý và ghi ra topic khác  
> → **hoặc THÀNH CÔNG TẤT CẢ**  
> → **hoặc KHÔNG CÓ GÌ CẢ**

👉 Đảm bảo **Atomic + Exactly-once** trong Kafka pipeline.

---

## 1️⃣ Vấn đề mà Kafka Transactions giải quyết

Giả sử flow phổ biến:
```yaml
  Consume từ topic A
    ↓
  Xử lý
    ↓
  Produce sang topic B
    ↓
  Commit offset
```

### ❌ Không dùng Transactions

| Tình huống | Kết quả |
|-----------|--------|
| Produce xong, crash trước commit offset | Duplicate xử lý |
| Commit offset xong, crash trước produce | Mất message |

➡️ **Không thể đạt exactly-once**

---

## 2️⃣ Kafka Transactions làm gì?

Kafka **gộp các hành động sau vào cùng một transaction**:

- Gửi message sang topic mới
- Commit offset của consumer

➡️ **Hoặc commit tất cả, hoặc rollback tất cả**

---

## 3️⃣ Flow chuẩn với Kafka Transactions
```yaml
beginTransaction()
  ↓
poll() từ topic A
  ↓
process()
  ↓
send() sang topic B
  ↓
sendOffsetsToTransaction()
  ↓
commitTransaction()
```

### 💥 Nếu có lỗi ở giữa
```yaml
abortTransaction()
```

➡️ Consumer sẽ đọc lại message  
➡️ Producer **KHÔNG bị duplicate**

## 4️⃣ Cấu hình bắt buộc

Producer
```yaml
enable.idempotence=true
transactional.id=my-tx-producer-1
```
📌 Có transactional.id ⇒ Kafka tự bật idempotent.

Consumer

```yaml
isolation.level=read_committed
enable.auto.commit=false
```

## 5️⃣ transactional.id là gì?

- **ID duy nhất** cho mỗi *logical producer*
- Kafka dùng `transactional.id` để:
  - Track **transaction state**
  - **Fence producer cũ** (zombie producer)

### 💥 Trường hợp nguy hiểm

Nếu **2 producer dùng chung `transactional.id`**:
- Producer mới lên sẽ **fence producer cũ**
- Producer cũ **không thể ghi tiếp**

👉 Tránh tình trạng **ghi trùng / ghi bừa** cực kỳ nguy hiểm

---

## 6️⃣ Transactions đảm bảo gì & KHÔNG đảm bảo gì?

### ✅ Đảm bảo

| Phạm vi | Exactly-once |
|------|-------------|
| Producer → Broker | ✅ |
| Consume → Process → Produce | ✅ |
| Commit offset | ✅ |

### ❌ KHÔNG đảm bảo

- Ghi DB ngoài Kafka (MySQL, Redis, …)
- Gọi HTTP / external service

👉 Muốn **EOS với DB**:
- **Outbox Pattern**
- Hoặc **DB Transaction + CDC (Debezium)**

---

## 7️⃣ So sánh nhanh

| Cơ chế | Dùng khi nào |
|------|-------------|
| Idempotent Producer | Chỉ produce |
| Kafka Transactions | Consume → Produce |
| Retry | Luôn luôn |
| Exactly-once end-to-end | Kafka-only pipeline |

---

## 8️⃣ Khi nào NÊN dùng Kafka Transactions?

### ✅ Nên dùng khi
- Kafka Streams
- Event processing pipeline
- ETL Kafka → Kafka
- Financial / Order processing

### ❌ Không cần khi
- Producer chỉ gửi **1 topic**
- Consumer chỉ đọc & ghi DB

---

## 9️⃣ Một câu để nhớ 🧠

> **Kafka Transactions = exactly-once cho pipeline Kafka → Kafka**

---
## Rebalance

## 🔄 Kafka Rebalance là gì?

Trong Kafka, **rebalance** là quá trình **phân chia lại các partition cho các consumer** trong cùng một consumer group khi có sự thay đổi.

👉 Nói ngắn gọn: **Kafka phải “chia lại việc”** 🧠⚖️

---

## 🎯 Rebalance xảy ra khi nào?

Rebalance sẽ được trigger khi **cấu trúc consumer group thay đổi**, ví dụ:

- ➕ Có consumer mới join group
- ➖ Consumer bị chết / disconnect
- 🔄 Consumer restart
- 📈 Topic tăng / giảm số partition
- ⏱️ Consumer không poll kịp → `session.timeout.ms`

---

## 🔄 Rebalance diễn ra như thế nào?

### 👉 Quy trình đơn giản

1. Tất cả consumer trong group **tạm dừng đọc**
2. Kafka **thu hồi partition** từ consumer cũ
3. Kafka **assign lại partition** cho các consumer
4. Consumer bắt đầu đọc lại từ **offset đã commit**

### 👉 Trong thời gian này
- ❌ Consumer **không xử lý message**
- ❌ Nếu rebalance xảy ra nhiều:
    - Lag tăng
    - Throughput giảm
    - Performance đi xuống rõ rệt

---

## 📦 Ví dụ dễ hiểu

Giả sử:

- **Topic**: `order-topic` có **6 partition**
- **Consumer group** có **2 consumer**

### 🔹 Trước khi rebalance
```text
Consumer-1 → P0, P1, P2
Consumer-2 → P3, P4, P5
```

➕ Thêm consumer C

Rebalance xảy ra:

```text
Consumer A: P0, P1
Consumer B: P2, P3
Consumer C: P4, P5
```

→ Tất cả consumer stop → reassign → resume

## ⚠️ Tại sao Rebalance nguy hiểm?

Rebalance **không hề free**:

- ❌ Dừng xử lý message **tạm thời**
- ❌ Có thể **xử lý trùng message** (do Kafka mặc định *at-least-once*)
- ❌ Với hệ thống **real-time** → cực kỳ khó chịu

👉 **Rebalance storm = ác mộng** 😵

---

## 🛠️ Làm sao để giảm Rebalance?

### 1️⃣ Tăng timeout hợp lý
- Cân chỉnh:
- 
```yaml
session.timeout.ms=30000
max.poll.interval.ms=300000
```

- Tránh consumer bị coi là *dead* khi xử lý lâu

---

### 2️⃣ Poll đều đặn
- Không xử lý business logic quá lâu trong `poll()`
- Tách xử lý nặng sang thread khác nếu cần

---

### 3️⃣ Dùng Static Membership
👉 Restart consumer **KHÔNG gây rebalance**

```yaml
group.instance.id=consumer-1
```

- Set `group.instance.id`
- Giữ assignment ổn định giữa các lần restart
- Tuy nhiên, không dùng với project
  - Có hơn 1 group-id trong project
  - Có concurrency > 1

---

### 4️⃣ Chọn assignor phù hợp

| Assignor | Đặc điểm |
|--------|--------|
| `RangeAssignor` | Mặc định, dễ lệch tải |
| `RoundRobinAssignor` | Chia đều hơn |
| `CooperativeStickyAssignor` | ✅ Ít gián đoạn nhất |

📌 **Khuyến nghị PROD**: `CooperativeStickyAssignor`

---

### 1️⃣ Static Membership là gì?

#### ❌ Mặc định (Dynamic Membership)
Kafka **nhận diện consumer bằng `consumer.id` (random)**

- Restart consumer = **consumer mới**
- Kafka nghĩ:
  > “À thằng cũ chết rồi, thằng mới vào”
- 👉 **Rebalance toàn bộ consumer group**

---

#### ✅ Static Membership
Kafka **nhận diện consumer bằng `group.instance.id` (do bạn đặt)**

- Restart consumer = **vẫn là consumer cũ**
- Kafka **GIỮ partition**
- 👉 **Không rebalance**

📌 **Nói ngắn gọn**:
> Restart **không đồng nghĩa** với leave / join group

---

### ⚠️ Lưu ý CỰC KỲ quan trọng

🔴 **`group.instance.id` PHẢI DUY NHẤT**

- Mỗi consumer → **1 ID riêng**
- Kubernetes thường map với:
  - `pod-name`
  - `hostname`
  - `instance-id`
- Tuy nhiên, không dùng với project
  - Có hơn 1 group-id trong project
  - Có concurrency > 1

❌ **2 consumer cùng `group.instance.id`**  
➡️ Kafka **đá 1 thằng ra ngoài**

---

### ✅ Khi nào nên dùng Static Membership?

- ✅ Consumer **restart thường xuyên**
- ✅ Dùng **Kubernetes / Docker / autoscaling**
- ✅ Muốn **ổn định partition assignment**

### ❌ Khi KHÔNG nên dùng
- ❌ Consumer ngắn hạn (job chạy xong là chết)

---

### 2️⃣ Assignor là gì?

**Assignor** quyết định:
> Partition nào → consumer nào

---

### 🔹 1. RangeAssignor *(default cũ)*

- Phân chia theo **range liên tục**
- ❌ Dễ **mất cân bằng** khi partition không chia hết
- ❌ Rebalance kiểu **Eager** → *stop toàn bộ*

Ví dụ

6 partition
3 consumer

```yaml
C1: P0, P1
C2: P2, P3
C3: P4, P5

```

---

### 🔹 2. RoundRobinAssignor

- Chia đều theo **vòng tròn**

```yaml
C1: P0, P3
C2: P1, P4
C3: P2, P5
```

- ✅ Cân hơn `RangeAssignor`
- ❌ Rebalance vẫn là **Eager** → dừng toàn bộ

---

### 🔹 3. StickyAssignor

👉 Giữ **partition cũ càng nhiều càng tốt**

- Khi rebalance → ít thay đổi assignment
- Giảm:
  - Cache miss
  - Warm-up
- ❌ Vẫn là **Eager Rebalance**

---

### 🔹 4. 🏆 CooperativeStickyAssignor *(Khuyên dùng)*

> **Đây là chân ái** ❤️

### 🔥 Khác biệt lớn

| Eager Rebalance | Cooperative Rebalance |
|---------------|----------------------|
| Stop toàn bộ | Thu hồi từng phần |
| Assign lại hết | Chuyển dần |
| Lag spike | Lag thấp |

👉 **Consumer không cần dừng hết** khi rebalance

Ví dụ cooperative

C1, C2 đang chạy

C3 join

```yaml
Step 1: C1 trả P2
Step 2: C3 nhận P2
Step 3: Các partition khác vẫn xử lý
```
* ✅ Không pause toàn group
* ✅ Rất phù hợp hệ thống lớn

### 🧩 Static Membership + Cooperative = Combo chuẩn production

```yaml
group.id=order-consumer
group.instance.id=${HOSTNAME}
partition.assignment.strategy=org.apache.kafka.clients.consumer.CooperativeStickyAssignor
```
🎯 Kết quả:

* Restart pod → ❌ rebalance
* Scale consumer → rebalance nhẹ
* Lag ổn định
* Ít duplicate message

---

## 🧠 Ghi nhớ nhanh

- Static Membership → **giảm rebalance khi restart**
- Assignor quyết định **độ gián đoạn**
- **Best combo PROD**:
  - `group.instance.id`
  - `CooperativeStickyAssignor`

## Rebalance có là 1 quá trình nên can thiệp không? 

👉 **KHÔNG nên “can thiệp” vào rebalance logic của Kafka**  
👉 **NHƯNG bắt buộc phải “KIỂM SOÁT” và “GIẢM TÁC ĐỘNG” của nó**

---

## 1️⃣ Rebalance có phải là thứ cần tránh tuyệt đối không?

❌ **Không**

👉 Rebalance là **cơ chế sống còn** của Kafka:

- Consumer chết → **phải chia lại**
- Scale up / down → **phải chia lại**
- Topic đổi số partition → **phải chia lại**

➡️ **Không rebalance = hệ thống không scale, không self-heal**

---

### 2️⃣ Vậy “can thiệp” nghĩa là gì? *(KHÔNG NÊN)*

#### ❌ Những thứ KHÔNG nên làm
- ❌ Tự viết lại thuật toán assign partition
- ❌ Hack consumer để giữ partition bằng mọi giá
- ❌ Block rebalance để “đỡ lag”
- ❌ Delay join group thủ công

👉 Hậu quả:
- Vỡ Kafka protocol
- Dead consumer
- Offset sai
- Lag **rất khó debug**

---

### 3️⃣ Thứ NÊN làm: **KIỂM SOÁT Rebalance**

Kafka cho phép bạn kiểm soát ở **3 level** 👇

---

#### 🧩 Level 1 – Cấu hình *(~80% hiệu quả)*

> Đây là **quan trọng nhất**

✅ **Giảm rebalance vô nghĩa**
- Consumer xử lý lâu → đừng để Kafka tưởng nó chết
- Poll đều đặn

✅ **Static Membership**
- 👉 Restart **≠ rebalance**

✅ **Cooperative Rebalance**
- 👉 Rebalance **từng phần**, không dừng toàn bộ

---

#### 🧩 Level 2 – Quan sát & Hook *(NÊN làm)*

👉 Dùng `ConsumerRebalanceListener`

- ✅ Đây là **can thiệp AN TOÀN**
- ✅ Không thay đổi logic Kafka
- ✅ Chỉ dùng để:
  - Chuẩn bị trước khi revoke
  - Dọn dẹp sau khi assign

---

#### 🧩 Level 3 – Kiến trúc *(PRO level)*

❌ **Sai**
```text
concurrency = 10
1 pod (Kubernetes)
```
✅ Đúng

```text
concurrency = 1
10 pod (Kubernetes)
```

### 4️⃣ Khi nào Rebalance là “vấn đề” thật sự?

🚨 **Khi:**
- Rebalance xảy ra **liên tục**
- Lag **spike** sau mỗi rebalance
- Message bị xử lý **trùng nhiều**
- Throughput **tụt mạnh**

👉 **Khi đó:**
- ❌ **KHÔNG phải lỗi Kafka**
- ✅ Là **config hoặc kiến trúc sai**

---

### 5️⃣ Checklist quyết định nhanh

| Việc | Có nên |
|----|--------|
| Tắt rebalance | ❌ |
| Hack Kafka | ❌ |
| Static membership | ✅ |
| Cooperative assignor | ✅ |
| Rebalance listener | ✅ |
| Scale bằng pod | ✅ |

---

### 🧠 Chốt lại 1 câu

> **Rebalance là định mệnh** 😄  
> Đừng chống lại nó — **hãy làm cho nó nhẹ nhàng**

---

## Sync/Async

### 1. Producer: Sync vs Async
Mặc định, `KafkaTemplate` của Spring hoạt động theo cơ chế **Async**. Tuy nhiên, bạn có thể cấu hình nó thành **Sync** tùy theo yêu cầu về độ tin cậy.

#### ⚡ Async Producer (Mặc định)
Khi gọi `send()`, Spring đẩy message vào một bộ đệm (buffer) nội bộ và trả về quyền điều khiển cho luồng (thread) hiện tại ngay lập tức.

* **Cơ chế:** Trả về một `CompletableFuture<SendResult>`. Bạn có thể đăng ký callback (`whenComplete`) để xử lý kết quả.
* **Ưu điểm:** Tốc độ cực nhanh, không làm nghẽn ứng dụng (high throughput).
* **Nhược điểm:** Dễ mất message nếu có lỗi phát sinh mà không xử lý callback cẩn thận.

#### 🔄 Sync Producer
Ép ứng dụng phải chờ đợi cho đến khi Kafka Broker xác nhận đã nhận được message.

* **Cơ chế:** Gọi phương thức `.get()` trên đối tượng `CompletableFuture`.

```text
// Ứng dụng sẽ dừng lại ở đây cho đến khi có kết quả từ Broker
kafkaTemplate.send(topic, data).get(); 
```

* **Ưu điểm:** Đảm bảo tin nhắn đã đến Broker, phù hợp cho giao dịch tài chính quan trọng.
* **Nhược điểm:** Giảm hiệu suất đáng kể do thread bị chặn (blocking).

---

### 2. Consumer: Sync vs Async
Ở phía Consumer, khái niệm này xoay quanh việc **Xác nhận đã đọc (Acking/Committing Offsets)**.

#### ⚡ Async Consumer (Mặc định)
Consumer xử lý message và gửi tín hiệu xác nhận (commit offset) mà không cần đợi Broker phản hồi.

* **Đặc điểm:** Tăng tốc độ vòng lặp xử lý (`poll loop`).
* **Rủi ro:** Nếu commit thất bại mà consumer vẫn chạy tiếp, có thể gây lặp dữ liệu hoặc mất dấu vị trí đọc khi xảy ra sự cố (*rebalance*).

#### 🔄 Sync Consumer
Consumer dừng lại và đợi Broker xác nhận lưu Offset thành công trước khi xử lý bản tin tiếp theo.

* **Đặc điểm:** Thường cấu hình qua `AckMode.MANUAL_SYNC`.
* **Ưu điểm:** Kiểm soát cực kỳ chặt chẽ vị trí đọc dữ liệu, tránh mất dấu dữ liệu.

---

### 📊 So sánh tổng quan

| Đặc điểm | Sync (Đồng bộ) | Async (Bất đồng bộ) |
| :--- | :--- | :--- |
| **Tốc độ** | Chậm (Latency cao) | Rất nhanh (Throughput cao) |
| **Độ tin cậy** | Cao (Biết ngay nếu lỗi) | Trung bình (Cần xử lý callback) |
| **Thread** | Bị chặn (Blocked) | Không bị chặn (Non-blocking) |
| **Sử dụng khi** | Dữ liệu quan trọng, cần thứ tự | Log, dữ liệu lớn, cần hiệu suất |

## Ví dụ 
## Hướng dẫn Kỹ thuật: Kafka Producer & Consumer (Sync/Async)

Tài liệu này hướng dẫn cách triển khai các cơ chế gửi và nhận tin nhắn trong Kafka sử dụng Spring Boot, bao gồm cả hai chế độ Đồng bộ (Sync) và Bất đồng bộ (Async).

---

## 1. Ví dụ về Producer

### Async Producer (Sử dụng Callback)
Đây là cách phổ biến nhất. Bạn gửi tin nhắn và tiếp tục làm việc khác, khi nào Kafka xong thì nó tự báo lại qua `CompletableFuture`.

```java
    public void sendMessageAsync(String message) {
        CompletableFuture<SendResult<String, String>> future = kafkaTemplate.send("my-topic", message);

        // Đăng ký callback để xử lý kết quả mà không làm block thread chính
        future.whenComplete((result, ex) -> {
            if (ex == null) {
                System.out.println("Gửi thành công offset: " + result.getRecordMetadata().offset());
            } else {
                System.err.println("Gửi thất bại: " + ex.getMessage());
            }
        });

        System.out.println("Thread chính vẫn tiếp tục chạy...");
    }
   ```

### Sync Producer (Dùng `.get()`)
Sử dụng khi bạn cần đảm bảo tin nhắn đã vào hàng chờ trước khi thực hiện bước tiếp theo (ví dụ: trừ tiền xong mới báo thành công).

```java
    public void sendMessageSync(String message) {
        try {
            // .get() sẽ bắt thread hiện tại dừng lại và chờ đợi phản hồi từ Kafka
            SendResult<String, String> result = kafkaTemplate.send("my-topic", message).get();
            System.out.println("Xác nhận đã gửi thành công: " + result.getRecordMetadata().offset());
        } catch (InterruptedException | ExecutionException e) {
            System.err.println("Lỗi khi gửi đồng bộ: " + e.getMessage());
        }
    }
```

---

## 2. Ví dụ về Consumer (Sync/Async Commit)

Trong Spring Kafka, việc "Sync/Async" ở Consumer thường nằm ở cách bạn **Commit Offset** (xác nhận đã đọc). Bạn cần cấu hình `AckMode` trong `ConcurrentKafkaListenerContainerFactory`.

### Sync Commit 

#### 1. Cấu hình thông qua `application.yml`

Để sử dụng tính năng Manual Commit, bạn cần tắt chế độ tự động và định nghĩa cách thức xác nhận trong phần `listener`.

```yaml
    spring:
      kafka:
        consumer:
          bootstrap-servers: localhost:9092
          group-id: my-group
          # Tắt chế độ tự động commit của Kafka Client thuần
          enable-auto-commit: false 
          auto-offset-reset: earliest
          key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
          value-deserializer: org.apache.kafka.common.serialization.StringDeserializer

        listener:
          # Chế độ xác nhận thủ công
          # MANUAL_SYNC: Commit đồng bộ (đợi broker xác nhận)
          # MANUAL: Commit bất đồng bộ (không đợi)
          ack-mode: manual_sync 
```

---

#### Giải thích các chế độ `ack-mode` phổ biến

Việc chọn `ack-mode` quyết định tính **Sync/Async** khi hệ thống xác nhận đã xử lý xong tin nhắn.

* **`record`**: Tự động commit ngay sau khi listener xử lý xong từng bản ghi đơn lẻ dù lần poll đó poll bao nhiên tin nhắn đi nữa.
* **`batch`** (Mặc định): Tự động commit sau khi đã xử lý toàn bộ danh sách bản ghi nhận được từ một lần `poll()`.
* **`manual`**: Bạn chủ động gọi `ack.acknowledge()`. Spring sẽ đưa yêu cầu commit vào hàng đợi và gửi đi bất đồng bộ (**Async**) ở lần poll tiếp theo.
* **`manual_sync`**: Bạn gọi `ack.acknowledge()`, Spring sẽ gửi yêu cầu commit ngay lập tức và dừng thread để đợi (**Sync**) phản hồi từ Kafka Broker.

> **Lưu ý:** `manual_sync` là chế độ an toàn nhất để đảm bảo dữ liệu không bị mất dấu offset, nhưng sẽ có độ trễ cao hơn so với `manual`.

---

#### Tóm tắt lựa chọn

| Chế độ | Loại | Đặc điểm |
| :--- | :--- | :--- |
| **Manual** | Async | Hiệu năng cao, không chờ đợi Broker xác nhận. |
| **Manual Sync** | Sync | Độ tin cậy tuyệt đối, đảm bảo Broker đã ghi nhận offset. |

#### Sử dụng manual trong code
Khi dùng chế độ **Manual**, bạn sẽ nhận được đối tượng `Acknowledgment` để tự tay commit.

```java
    @KafkaListener(topics = "my-topic", groupId = "my-group")
    public void listen(String message, Acknowledgment ack) {
        try {
            System.out.println("Đang xử lý: " + message);
            // Giả lập xử lý logic...

            // Gọi commit
            ack.acknowledge(); 
            // Nếu ở trên cấu hình MANUAL_SYNC, dòng này sẽ block thread cho đến khi commit xong.
        } catch (Exception e) {
            // Xử lý lỗi, không gọi ack.acknowledge() để tin nhắn không bị mất
        }
    }
```

Lưu ý quan trọng:
* Enable-auto-commit: Phải set là false thì cấu hình ack-mode của Spring mới có tác dụng thực sự theo ý muốn thủ công của bạn.
* Hiệu suất: manual_sync an toàn nhưng sẽ làm chậm tốc độ xử lý của Consumer một chút vì tốn thời gian chờ đợi mạng (network round-trip) cho mỗi lần commit.

---

## 3. Bảng so sánh kịch bản sử dụng

| Kịch bản | Khuyên dùng | Lý do |
| :--- | :--- | :--- |
| **Gửi Log/Tracking** | `Async Producer` | Mất vài dòng log không quan trọng bằng việc làm chậm hệ thống. |
| **Giao dịch Ngân hàng** | `Sync Producer` | Phải chắc chắn dữ liệu đã vào Kafka trước khi báo "Thành công" cho user. |
| **Xử lý Data lớn** | `Async Commit` | Tối ưu tốc độ đọc, chấp nhận rủi ro xử lý lặp nếu crash. |
| **Xử lý đơn hàng** | `Sync Commit` | Đảm bảo xử lý xong cái này mới qua cái khác, tránh sai sót dữ liệu. |
