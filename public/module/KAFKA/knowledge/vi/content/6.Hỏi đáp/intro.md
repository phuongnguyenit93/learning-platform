## Một số câu hỏi về Kafka

### 1. Chuyện gì sẽ xảy ra khi consumer bị ngắt kết nối giữa chừng ?
- Kafka không push message trực tiếp vào consumer, mà:

    * Message được lưu bền vững (persist) trong topic partition
    * Consumer chủ động pull message
    * Kafka chỉ coi message là đã đọc xong khi offset được commit

👉 Vì vậy:
* Khi consumer bị tắt / crash / pause → message vẫn nằm nguyên trong Kafka

👉 Khi consumer start lại:
* Kafka sẽ đọc từ offset đã commit gần nhất
* Các message chưa được commit → được đọc lại

✅ Message trong thời gian consumer bị tắt → đọc lại được

👉 Tuy nhiên, đối với message đang xử lý mà consumer bị tắt, nếu đã commit offset thì coi như message đó đã mất

### 2. Message tồn tại trong bao lâu ? Làm sao để điều chỉnh thời gian tồn tại ? Chuyện gì xảy ra nếu message đã xóa nhưng consumer chưa commit offset ?

- Thời gian tổn tại của message dựa theo retention
- Retention dựa thao thời gian hoạc dung lượng
- Cách thức xóa cũng sẽ dựa theo cleanup policy (Compact hoặc Delete)
    - Delete : Xóa theo thời gian / size : Và xóa cái xa nhất
    - Compact : Giữ message cuối cùng theo key

#### Nếu message đã xóa nhưng chưa commit offset
- Mất message đó
- Ngoài ra có 3 case sau

1. Case 1: auto.offset.reset=latest
* ➡️ Kafka nhảy thẳng tới offset mới nhất
* ➡️ ❌ MẤT TOÀN BỘ MESSAGE CŨ

2. Case 2: auto.offset.reset=earliest
* ➡️ Kafka đọc từ message còn tồn tại sớm nhất
* ➡️ ❌ MẤT MESSAGE ĐÃ BỊ XÓA

3. Case 3: auto.offset.reset=none
* ➡️ ❌ Consumer CRASH
* ➡️ OffsetOutOfRangeException

#### Kafka có 3 cấp cấu hình retention (theo thứ tự ưu tiên):
* Topic config  >  Broker config  >  Default

### 3. Làm sao để các massage khi gửi cần theo thứ tự nó vào cùng partition trong 1 topics ? Vì các thứ tư giữa các partition không đảm bảo

#### 👉 Kafka chỉ đảm bảo thứ tự trong 1 partition

❌ Không bao giờ đảm bảo thứ tự:

* Giữa các partition
* Sau khi tăng partition cho cùng 1 key (nếu dùng sai cách)

#### Vậy làm sao đảm bảo message của 1 consumer luôn ở cùng 1 partition?

* CÁCH DUY NHẤT: DÙNG MESSAGE KEY
    * Producer phải gửi message có key
```text
kafkaTemplate.send("deposit-money-event", userId, message);
```
Kafka sẽ

```text
partition = hash(userId) % partition_count
```

📌 Kết quả:
* Cùng userId → luôn vào cùng partition
* Thứ tự của user đó được đảm bảo

#### Vậy nếu khi tăng partition thì sao?
⚠️ Đây là điểm nhiều người dính lỗi

Giả sử ban đầu:

```text
partition_count = 3
partition = hash(userId) % 3
```

Sau đó bạn tăng lên:
```text
partition_count = 6
partition = hash(userId) % 6
```

➡️ KẾT QUẢ:
1. [x] Cùng userId → vào partition KHÁC
2. [x] Thứ tự bị phá

#### Cách KHẮC PHỤC khi cần tăng partition

Cách 1 (Chuẩn nhất): Chấp nhận MẤT ORDER khi scale

✔️ Phổ biến

✔️ Kafka design chấp nhận

➡️ Với hệ thống không yêu cầu strict ordering toàn cục

* Cách 2: Dùng Custom Partitioner (nâng cao)
```text
public class FixedPartitioner implements Partitioner {
@Override
public int partition(String topic, Object key, byte[] keyBytes,Object value, byte[] valueBytes, Cluster cluster) {
        return Math.abs(key.hashCode()) % 3; // CỐ ĐỊNH
    }
}
```

➡️ Dù topic tăng partition:

* Key vẫn map vào 3 partition đầu
* Partition mới chỉ dùng cho key mới

### 4. Vì sao Kafka không xoá message sau khi đọc?

1. Trả lời ngắn gọn

Kafka không xoá message sau khi đọc vì Kafka không phải message queue thuần, mà là distributed log

* Consumer đọc ≠ tiêu thụ (consume)
* Consumer chỉ di chuyển offset, message vẫn nằm đó

2. Kafka nhìn message như thế nào?

Kafka coi mỗi topic là:

LOG = chuỗi sự kiện bất biến (immutable)

Ví dụ:
```
offset 0: UserCreated
offset 1: OrderCreated
offset 2: PaymentSuccess
```

❗ Những event này là sự thật lịch sử, không phải “việc cần làm xong thì xoá”.

3. Nếu xoá sau khi đọc thì chuyện gì xảy ra?

Kafka cố tình không làm vậy vì nó sẽ phá vỡ rất nhiều thứ 👇

❌ Không replay được

* Consumer mới join
* Consumer crash rồi restart
* ➡️ Không còn message để đọc lại

❌ Không fan-out được

* Service A cần message
* Service B cũng cần message

➡️ Nếu xoá:

* Ai đọc trước → người kia mất
* Kafka cho phép:
* 1 message → N consumer group đọc độc lập

❌ Không scale / rebalance được

* Consumer chết
* Kafka rebalance partition
* ➡️ Consumer mới không có dữ liệu để tiếp tục

4. Kafka phù hợp cho bài toán nào?

* Kafka sinh ra để:
* Event-driven architecture
* Audit log
* CDC (Debezium)
* Streaming (Flink, Kafka Streams)
* Microservice communication (event)

❌ Không phù hợp:

* Job cần “làm xong rồi xoá”
* RPC / request-response

5. Chốt hạ 🧠

Kafka không xoá message sau khi đọc vì:

* Muốn nhiều consumer đọc độc lập
* Muốn replay
* Muốn scale & rebalance
* Muốn giữ lịch sử sự kiện
* ➡️ Xoá theo retention, không theo consumer.

### 5. Kafka có thuộc về Integration ?

#### 👉 CÓ – nhưng chưa đủ

1. Kafka trong Integration

Kafka thuộc nhóm Integration Middleware, vì:

* Kết nối nhiều hệ thống / microservice
* Giúp các service không phụ thuộc trực tiếp vào nhau
* Thay thế kiểu gọi:

Service A → REST → Service B

bằng:

Service A → Kafka → Service B

📌 Trong sơ đồ kiến trúc:

#### Kafka nằm ở Integration Layer

Cùng nhóm với:

* Message Broker
* ESB (Enterprise Service Bus)
* Event Bus

2. Kafka KHÔNG chỉ là Integration

Kafka còn dùng cho:

* Event-driven architecture
* Event sourcing
* Streaming analytics
* Data pipeline (CDC, ETL, log collection)

👉 Vì vậy:

Kafka = Integration + Event platform + Data pipeline

### 6. Việc có nhiều active consumer có giúp việc xử lý message nhanh hơn ?

#### Câu trả lời ngắn gọn – chuẩn bản chất Kafka là:

❌ KHÔNG PHẢI LÚC NÀO active consumer nhiều hơn cũng xử lý nhanh hơn

1️⃣ Kafka không scale theo consumer, mà scale theo partition

Kafka chỉ song song ở partition level.

➡️ 1 partition tại 1 thời điểm = 1 consumer

Nên:

* Throughput tối đa = số partition
* KHÔNG PHỤ THUỘC trực tiếp vào active consumer

### Bảng chân lý Consumer & Partition (Rất quan trọng)

Bảng dưới đây mô tả mối quan hệ giữa **số lượng Partition** và **số lượng Consumer trong cùng Consumer Group**, từ đó xác định khả năng xử lý song song của Kafka.

| Partition | Active Consumer | Consumer xử lý thật | Tổng nhanh hơn? |
|-----------|-----------------|---------------------|------------------|
| 3         | 1               | 1                   | ❌               |
| 3         | 3               | 3                   | ✅               |
| 3         | 6               | 3 (3 idle)          | ❌               |
| 6         | 3               | 3                   | ❌ (chưa tận dụng hết) |
| 6         | 6               | 6                   | ✅               |

👉 **Chỉ nhanh hơn khi:**  
**Active Consumer ≤ Partition**

---

### Ví dụ rất đời thực 🧠

#### Case A: Topic có 1 Partition

- **Active Consumer**: 10

**Thực tế:**
- 10 consumer cùng subscribe
- Nhưng chỉ **1 consumer** được gán partition và xử lý dữ liệu
- 9 consumer còn lại ở trạng thái idle

👉 **Tổng tốc độ không đổi**

---

#### Case B: Topic có 6 Partition

- **Active Consumer**: 6

**Thực tế:**
- 6 partition
- Mỗi consumer xử lý 1 partition
- Dữ liệu được xử lý **song song hoàn toàn**

👉 **Nhanh hơn ~6 lần** (đặc biệt hiệu quả với xử lý nặng)

---

#### Case C: Topic có 6 Partition

- **Active Consumer**: 12

**Thực tế:**
- 6 consumer được gán partition và xử lý
- 6 consumer còn lại **không có việc làm (idle)**

👉 **Không nhanh hơn**, còn **tốn thêm tài nguyên**

---

4️⃣ Khi nào active consumer nhiều hơn lại… chậm hơn?

* Nghe ngược nhưng có thật

❌ Quá nhiều consumer → rebalance liên tục

* Scale up/down
* Pod restart
* Consumer join/leave group

➡️ Kafka phải:

* Pause consume
* Re-assign partition
* Resume

👉 Throughput tụt

❌ Consumer nhẹ nhưng DB / API downstream chậm

* Kafka nhanh
* DB chậm

➡️ Tăng consumer chỉ làm:

* DB quá tải
* Timeout
* Retry

👉 Tổng system chậm hơn

5️⃣ Khi nào active consumer nhiều hơn là đúng bài?

✅ ĐÚNG khi:

* Message xử lý nặng (CPU / IO)
* Có nhiều partition
* Consumer ổn định, ít rebalance
* Downstream chịu tải tốt

- Kết luận gói gọn để nhớ lâu 🧠

    * Active consumer nhiều hơn KHÔNG tự động nhanh hơn
    * Partition mới là nút cổ chai
    * Consumer dư chỉ để nhìn cho vui trong Kafka-UI
    * Scale sai có thể còn chậm hơn

### 7. Kiểu dữ liệu gửi/ nhận của Kafka ? 

* Về cơ bản , Kafka message thực chất chỉ là byte khi broker nhận/gửi , còn gửi/nhận kiểu nào thì do serialize / deserialize quyết định

#### Đối với producer

```text
spring:
  kafka:
    producer:
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
```

* Có thể thay JsonSerializer bằng StringSerializer

#### Đối với consumer

```text
spring:
  kafka:
    consumer:
      value-deserializer: org.springframework.kafka.support.serializer.JsonDeserializer
      properties:
        spring.json.trusted.packages: "*"
```

* Có thể thay JsonDeserializer bằng StringDeserializer

#### Lưu ý

* Consumer và Producer không nhất thiết phải cùng loại (String -> String, Json -> Json) . Miễn sao mỗi bên có cách xử lý dữ liệu phù hợp là được
* Trong kafka broker , chỉ hiểu message là byte[].

```text
❝ Producer quyết định format
Consumer quyết định cách hiểu ❞
```
