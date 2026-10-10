## Apache Kafka

**Apache Kafka** là một nền tảng **event streaming phân tán** được thiết kế để xử lý các luồng dữ liệu thời gian thực với **hiệu năng cao**, **độ trễ thấp** và **khả năng mở rộng lớn**. Kafka thường được sử dụng trong các hệ thống **microservices**, **event-driven architecture** và **real-time data pipeline**.

Kafka hoạt động theo mô hình **publish / subscribe**, trong đó dữ liệu được gửi và nhận thông qua các **topic**. Mỗi topic có thể được chia thành nhiều **partition**, cho phép xử lý song song và mở rộng theo chiều ngang.

### Các khái niệm chính

- **Producer**: Thành phần gửi message vào Kafka topic
- **Consumer**: Thành phần đọc message từ Kafka topic
- **Broker**: Kafka server chịu trách nhiệm lưu trữ và phân phối message
- **Topic**: Kênh логical dùng để phân loại message
- **Partition**: Phân vùng của topic, giúp tăng khả năng song song và mở rộng
- **Consumer Group**: Nhóm consumer cùng đọc một topic, mỗi partition chỉ được xử lý bởi một consumer trong group

### Ưu điểm của Kafka

- High throughput, xử lý lượng lớn message
- Fault-tolerant với cơ chế replication
- Lưu trữ dữ liệu bền vững trên đĩa
- Dễ dàng mở rộng mà không gián đoạn hệ thống
- Hỗ trợ tốt cho kiến trúc bất đồng bộ và event-driven

## Tài liệu

* https://spring.io/projects/spring-kafka?utm_source=chatgpt.com#learn
* https://docs.spring.io/spring-boot/reference/messaging/kafka.html?utm_source=chatgpt.com
* https://docs.spring.io/spring-kafka/docs/3.0.x/reference/html/?utm_source=chatgpt.com

## Một số thuật ngữ trong Kafka

### Broker
**Broker** là một server Kafka, chịu trách nhiệm:
- Nhận message từ Producer
- Lưu trữ message vào disk : Message -> Topic → Partition → Broker lưu trên disk
- Phân phối message cho Consumer

Một Kafka cluster bao gồm nhiều broker để đảm bảo **high availability** và **scalability**.

Ngoài ra các broker còn phân công nhiệm vụ Leader & Follower
#### Mỗi partition có:

* 1 Leader (xử lý read/write)
* N Follower (replica)

#### Nguyên tắc:
* Producer & Consumer chỉ nói chuyện với Leader
* Khi 1 broker Leader sập , thì broker follower sẽ lên làm leader => Data không bị mất
* Chia partition quản lý => Giảm tải kafka và phân tán Disk/CPU/Network

Ví dụ (replicas=3):
```text
Partition 0:
Leader: Broker 1
Follower: Broker 2, Broker 3
```

---

### Cluster

**Kafka Cluster** là tập hợp nhiều **broker** hoạt động cùng nhau để cung cấp một hệ thống **phân tán**, đảm bảo **khả năng mở rộng**, **tính sẵn sàng cao (high availability)** và **chịu lỗi**.

Một cluster Kafka chịu trách nhiệm:
- Lưu trữ và phân phối message
- Quản lý topic, partition và replica
- Đảm bảo dữ liệu không bị mất khi broker gặp sự cố

---

#### Thành phần của Kafka Cluster

- **Broker**: Các node chính trong cluster, lưu trữ dữ liệu và xử lý request
- **Controller**: Điều phối cluster, quản lý metadata và leader election
- **Topic / Partition / Replica**: Cấu trúc dữ liệu phân tán trong cluster

---

#### Cluster và Khả năng Mở rộng

- Có thể thêm broker mới vào cluster mà không cần downtime
- Partition được phân bố trên nhiều broker
- Consumer group cho phép scale out việc xử lý dữ liệu

---

#### Cluster và Khả năng Chịu lỗi

- Dữ liệu được replicate trên nhiều broker
- Khi một broker down, leader sẽ được bầu lại từ ISR
- Consumer và producer tự động reconnect

---

#### Best Practices

- Số lượng broker ≥ replication factor
- Không sử dụng single broker cho môi trường production
- Giám sát cluster bằng các công cụ như Kafdrop, AKHQ, Prometheus

> Kafka Cluster là nền tảng cốt lõi để xây dựng các hệ thống **event-driven** và **microservices** có độ tin cậy cao.

--- 
### Producer
**Producer** là thành phần gửi dữ liệu (message/event) vào Kafka.
- Producer gửi message đến một **topic**
- Message sẽ được ghi vào một **partition** cụ thể
- Có thể cấu hình cơ chế **acks**, **retry**, **batching** để đảm bảo độ tin cậy

---

### Consumer
**Consumer** là thành phần đọc dữ liệu từ Kafka.
- Consumer subscribe vào một hoặc nhiều topic
- Dữ liệu được đọc theo thứ tự trong từng partition
- Consumer quản lý offset để xác định message đã xử lý
- 4 trạng thái để điều khiển 1 consumer : start, stop, pause, resume.
#### Trạng thái Consumer

- **Start**  
  Khởi động consumer để bắt đầu lắng nghe và xử lý message từ Kafka.  
  Khi start, consumer đọc dữ liệu từ offset đã commit gần nhất.
  Trường hợp chưa có offset hoặc offset đã bị mất do retention, Kafka sẽ sử dụng auto.offset.reset (earliest / latest) để xác định vị trí bắt đầu đọc.

- **Stop**  
  Dừng hoàn toàn consumer và giải phóng tài nguyên.  
  Consumer sẽ ngắt kết nối với Kafka broker và không tiếp tục xử lý message.

- **Pause**  
  Tạm thời dừng việc consume message nhưng **vẫn giữ kết nối** với Kafka.  
  Offset không thay đổi trong thời gian pause.

- **Resume**  
  Tiếp tục consume message từ vị trí offset đã dừng trước đó.  
  Consumer không bị rebalance lại khi resume.

> Việc sử dụng **pause / resume** giúp kiểm soát luồng dữ liệu tốt hơn trong các trường hợp bảo trì, quá tải hoặc xử lý sự cố tạm thời.

---

### Topic
**Topic** là một kênh логical dùng để phân loại message.
- Topic không tự giới hạn số lượng message
- Message trong topic được lưu trữ theo thứ tự
- Một topic có thể có nhiều partition

---

### Partition
**Partition** là đơn vị lưu trữ nhỏ nhất của topic.
- Cho phép xử lý song song dữ liệu (Parallel processing)
- Mỗi partition chỉ được consume bởi **một consumer trong cùng consumer group**
- Đảm bảo thứ tự message **trong phạm vi partition**

--- 

### Replica

**Replica** là các bản sao của **partition** trong Kafka, được sử dụng để đảm bảo **tính sẵn sàng (high availability)** và **khả năng chịu lỗi (fault tolerance)**.

- Mỗi partition có thể có nhiều replica
- Một replica được bầu làm **Leader**
- Các replica còn lại là **Follower**
- Producer và Consumer **chỉ làm việc với Leader**

#### Leader và Follower

- **Leader Replica**
    - Nhận message từ Producer
    - Phân phối message cho Consumer
    - Chịu trách nhiệm ghi dữ liệu chính

- **Follower Replica**
    - Đồng bộ dữ liệu từ Leader
    - Không xử lý trực tiếp request từ Producer / Consumer
    - Sẵn sàng thay thế Leader khi xảy ra sự cố

#### In-Sync Replicas (ISR)

**ISR (In-Sync Replicas)** là tập hợp các replica:
- Được đồng bộ đầy đủ với Leader
- Đáp ứng yêu cầu về độ trễ cho phép
- Có khả năng được bầu làm Leader

Nếu Leader gặp sự cố, Kafka sẽ:
- Chọn một replica trong ISR làm Leader mới
- Đảm bảo dữ liệu không bị mất hoặc mất ở mức tối thiểu

#### Replica và Độ Tin Cậy Dữ Liệu

- Số lượng replica được cấu hình thông qua `replication.factor`
- Replica càng nhiều → độ an toàn dữ liệu càng cao
- Replica nhiều cũng làm tăng chi phí tài nguyên

```properties
replication.factor=3
```

---
### Consumer Group
**Consumer Group** là tập hợp các consumer cùng đọc dữ liệu từ một topic.
- Kafka phân phối mỗi partition cho một consumer trong group
- Giúp mở rộng khả năng xử lý (scale out)
- Nếu một consumer bị down, partition sẽ được gán lại cho consumer khác
- Đảm bảo 1 message không xử lý trùng trong cùng group (Vì 1 message chỉ được xử lý bởi 1 consumer trong group)

---
### Compact và Delete

Kafka hỗ trợ hai cơ chế dọn dẹp dữ liệu (log cleanup policy):

- **Delete**
    - Message sẽ bị xóa sau một khoảng thời gian hoặc khi vượt quá dung lượng cấu hình
    - Phù hợp với các use case xử lý event thông thường
    - Cấu hình bằng:
      ```properties
      log.cleanup.policy=delete
      ```

- **Compact**
    - Kafka chỉ giữ lại **message mới nhất cho mỗi key**
    - Các message cũ có cùng key sẽ bị loại bỏ
    - Phù hợp với các use case lưu trạng thái (state), ví dụ: user profile, configuration
    - Cấu hình bằng:
      ```properties
      log.cleanup.policy=compact
      ```

> Có thể kết hợp cả hai: `cleanup.policy=compact,delete`

---

### Retention Time và Delete Retention Time

#### Retention là cơ chế xóa message, không xóa offset → offset trở nên invalid

- **Retention Time (`retention.ms`)**
    - Thời gian Kafka giữ message trước khi xóa
    - Áp dụng cho topic dùng chính sách **delete**
    - Ví dụ:
      ```properties
      retention.ms=604800000 # 7 ngày
      ```

- **Delete Retention Time (`delete.retention.ms`)**
    - Thời gian Kafka giữ **tombstone message** (message có value = null)
    - Áp dụng cho topic dùng **log compaction**
    - Sau thời gian này, key tương ứng có thể bị xóa hoàn toàn
    - Ví dụ:
      ```properties
      delete.retention.ms=86400000 # 1 ngày
      ```

---

### StreamBridge

**StreamBridge** là một thành phần trong **Spring Cloud Stream**, cho phép:
- Gửi message vào Kafka **mà không cần binding sẵn**
- Gửi message **động** tại runtime
- Phù hợp với các use case publish event linh hoạt

Ví dụ sử dụng:
```
    streamBridge.send("output-topic", message);
```

**Ưu điểm của StreamBridge:**

- Không phụ thuộc chặt chẽ vào cấu hình binding
- Dễ sử dụng trong kiến trúc event-driven
- Phù hợp cho microservices Spring Boot

---
### Offset

**Offset** là một số nguyên dùng để xác định **vị trí của message** trong một partition của Kafka.

- Mỗi message trong một partition có **offset duy nhất và tăng dần**
- Offset giúp Kafka xác định message nào đã được consumer xử lý
- Offset chỉ có ý nghĩa **trong phạm vi một partition**

Consumer sử dụng offset để:
- Đọc tiếp message từ đúng vị trí đã xử lý trước đó
- Tránh xử lý trùng lặp message
- Hỗ trợ cơ chế retry và fault tolerance

Ghi chú thêm:
- Thuộc tính auto.offset.reset không ảnh hưởng nếu offset đã được commit và còn hợp lệ
- Offset được quản lý theo consumer group

---

### Commit

**Commit** là cơ chế dùng để **lưu offset** mà consumer đã xử lý thành công, giúp Kafka xác định vị trí đọc tiếp theo khi consumer restart hoặc xảy ra sự cố.

Commit của consumer = việc ghi lại “tôi đã xử lý xong tới message nào rồi”

Cụ thể hơn:

* Kafka không tự biết consumer đã xử lý xong message hay chưa
* Consumer phải nói cho Kafka biết bằng cách commit offset

Commit offset đảm bảo:
- Tránh xử lý trùng lặp message
- Hỗ trợ khôi phục (recovery) khi consumer bị restart
- Kiểm soát độ tin cậy của quá trình consume

#### Commit offset được lưu ở đâu?

➡️ Kafka lưu commit offset vào internal topic:
```
    __consumer_offsets
```

Key gồm:
* group.id
* topic
* partition

📌 Vì vậy:
- Cùng group.id → dùng chung offset
- Khác group.id → đọc lại từ đầu

#### Các hình thức Commit

- **Auto Commit**
    - Kafka tự động commit offset theo chu kỳ cấu hình
    - Không quan tâm bạn xử lý xong hay chưa
    - Dễ cấu hình nhưng có thể gây mất message nếu xử lý chưa hoàn tất
  ```properties
  enable.auto.commit=true
  auto.commit.interval.ms=5000
- **Manual Commit**
    - Consumer chủ động commit offset sau khi xử lý message thành công
    - Kiểm soát tốt hơn, phù hợp với hệ thống yêu cầu độ tin cậy cao
  ```properties
  enable.auto.commit=false
  ```
  #### Code commit manual
    ```
    @KafkaListener
    public void listen(String msg, Acknowledgment ack) {
    // xử lý xong
    ack.acknowledge();
    }
    ```
  or
    ```  
    consumer.commitSync();
    ``` 

#### Commit Sync và Commit Async
- Commit Sync

    - Chờ Kafka broker xác nhận commit thành công
    - Đảm bảo offset được lưu chính xác
    - Có thể làm giảm throughput

- Commit Async

    - Không chờ phản hồi từ broker
    - Tăng hiệu năng
    - Có rủi ro commit thất bại mà không được phát hiện

#### Commit và Consumer Group
- Offset được commit theo Consumer Group
- Mỗi consumer group có offset riêng cho từng partition
- Khi xảy ra rebalance, Kafka sẽ sử dụng offset đã commit gần nhất

---

### Controller

**Controller** là một broker đặc biệt trong Kafka cluster, chịu trách nhiệm **điều phối và quản lý trạng thái của cluster**.

Các nhiệm vụ chính của Controller:
- Quản lý metadata của cluster (topic, partition, replica)
- Thực hiện **leader election (bầu cử leader)** cho partition
- Giám sát trạng thái của broker (broker join / leave) hoặc (broker dead/alive)
- Xử lý sự kiện **failover** khi broker hoặc replica gặp sự cố

#### Lưu ý
- Broker không nhận message
- Broker không lưu data
- Broker không đọc/ghi topic

#### Controller trong ZooKeeper Mode

- Controller được **bầu chọn thông qua ZooKeeper**
- Tại một thời điểm trong 1 cluster chỉ có **một Controller duy nhất**
- Mọi thay đổi metadata đều được ghi nhận và đồng bộ qua ZooKeeper

---

#### Controller trong KRaft Mode

- Controller được quản lý thông qua **Raft consensus**
- Không phụ thuộc vào ZooKeeper
- Metadata được lưu trữ trong **metadata log** nội bộ Kafka
- Có thể có nhiều controller node nhưng chỉ **một controller leader** hoạt động tại một thời điểm

---

#### Vai trò của Controller đối với Cluster

- Đảm bảo cluster hoạt động ổn định và nhất quán
- Điều phối cluster
- Tự động khôi phục khi có sự cố
- Là thành phần cốt lõi để Kafka đảm bảo **high availability**

> Trong các phiên bản Kafka mới, **KRaft Controller** là kiến trúc mặc định và là hướng phát triển lâu dài của Kafka.

#### Lưu ý quan trọng

* Nếu Controller chết → Kafka bầu Controller mới
* Message KHÔNG bị mất
* Có thể chậm vài giây trong thời gian re-election

---

### KRaft và ZooKeeper

Kafka hỗ trợ hai cơ chế quản lý metadata và điều phối cluster: **ZooKeeper** (truyền thống) và **KRaft** (Kafka Raft – kiến trúc mới).

#### ZooKeeper

**ZooKeeper** từng là thành phần bắt buộc trong Kafka để:
- Quản lý metadata của cluster (broker, topic, partition)
- Thực hiện leader election cho partition
- Theo dõi trạng thái broker

Nhược điểm:
- Phụ thuộc thêm một hệ thống bên ngoài
- Tăng độ phức tạp trong vận hành
- Khó mở rộng và bảo trì ở quy mô lớn

---

#### KRaft (Kafka Raft)

**KRaft** là kiến trúc mới của Kafka, sử dụng thuật toán **Raft** để quản lý metadata **nội bộ Kafka**, không cần ZooKeeper.

Ưu điểm của KRaft:
- Loại bỏ sự phụ thuộc vào ZooKeeper
- Đơn giản hóa kiến trúc hệ thống
- Tăng hiệu năng và độ ổn định
- Thời gian khởi động và recovery nhanh hơn

Trong chế độ KRaft:
- Kafka controller được tích hợp trực tiếp trong broker
- Metadata được lưu trữ trong **metadata log**
- Leader election được thực hiện thông qua Raft consensus

---

#### So sánh nhanh

| Tiêu chí        | ZooKeeper           | KRaft                |
|-----------------|---------------------|----------------------|
| Phụ thuộc ngoài | Có                  | Không                |
| Quản lý metadata| ZooKeeper           | Kafka nội bộ         |
| Độ phức tạp     | Cao                 | Thấp hơn             |
| Tương lai Kafka | Đã deprecated       | Kiến trúc mặc định   |

> **KRaft** là hướng phát triển chính và sẽ thay thế hoàn toàn ZooKeeper trong các phiên bản Kafka mới.

#### Quản lý Offset

- **Auto Commit**
    - Kafka tự động commit offset theo chu kỳ
    - Đơn giản nhưng có thể gây mất message nếu xử lý chưa xong
  ```properties
  enable.auto.commit=true

---
### Poll

### Kiến thức chuyên sâu: Cơ chế Poll trong Kafka

Trong Kafka, **Poll** là hành động mà Consumer chủ động gửi yêu cầu đến Kafka Broker để "kéo" (pull) dữ liệu về, thay vì đợi Broker đẩy dữ liệu xuống.

---

### 1. Cơ chế hoạt động của Poll

Khi chạy `@KafkaListener`, Spring Boot vận hành một vòng lặp vô tận (`while loop`) thực hiện lệnh `poll()`. Quy trình diễn ra như sau:

1.  **Gửi yêu cầu**: Consumer hỏi Broker: *"Tôi thuộc nhóm A, đang ở offset X, cho tôi xin các bản ghi tiếp theo"*.
2.  **Đợi dữ liệu (Blocking)**: Nếu Broker chưa có dữ liệu, Consumer sẽ đợi trong một khoảng thời gian (`timeout`) nhất định.
3.  **Nhận dữ liệu (Batch)**: Broker gửi về một xấp bản ghi (`ConsumerRecords`).
4.  **Xử lý**: Consumer xử lý hết danh sách đó rồi mới quay lại bước 1.

---

## 2. Các tham số cấu hình tối ưu hiệu suất

Bạn có thể điều chỉnh các tham số này trong `application.yml`:

```yaml
    spring:
      kafka:
        consumer:
          # Số lượng bản ghi tối đa trong 1 lần poll (Mặc định: 500)
          max-poll-records: 500

          # Thời gian tối đa giữa 2 lần poll (Mặc định: 300000ms - 5 phút)
          # Nếu xử lý quá lâu vượt mức này, Kafka sẽ coi Consumer đã "chết".
          properties:
            max.poll.interval.ms: 300000

          # Lượng dữ liệu tối thiểu (byte) Broker phải gom đủ mới gửi về
          fetch-min-size: 1
```

---

## 3. Mối quan hệ giữa Poll và AckMode

Cách thức Commit Offset phụ thuộc mật thiết vào vòng lặp Poll:

* **BATCH**: Xử lý xong **tất cả** bản ghi trong lần poll đó rồi mới commit một lần duy nhất.
* **RECORD**: Xử lý xong **từng** bản ghi trong lần poll đó là commit ngay lập tức cho bản ghi đó.

---

## 4. Tại sao Kafka dùng cơ chế Pull (Poll)?

| Ưu điểm | Chi tiết |
| :--- | :--- |
| **Tránh làm ngộp Consumer** | Consumer tự quyết định tốc độ lấy tin nhắn, không sợ bị Broker "dội bom" dữ liệu khi đang bận. |
| **Tối ưu hóa Batching** | Gom được nhiều tin nhắn để xử lý cùng lúc, giúp tăng băng thông đáng kể. |

> **Cảnh báo:** `poll()` chính là "nhịp tim" của Consumer. Nếu logic code xử lý quá lâu (lâu hơn `max-poll-interval-ms`), Consumer sẽ bị văng ra khỏi Consumer Group và kích hoạt quá trình **Rebalance**.

---
