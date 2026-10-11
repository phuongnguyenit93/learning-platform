## Hướng dẫn setup và build 1 project Kafka

### 1. Setup Kafka với Docker Compose

Sử dụng `docker-compose` là cách nhanh nhất để khởi tạo Kafka phục vụ cho môi trường **local development**.

#### Yêu cầu
- Docker
- Docker Compose

#### Cấu trúc thư mục
```text
project-root
├── docker-compose.yml
└── README.md
```
### Docker Compose Configuration

Sử dụng Docker Compose để khởi tạo Kafka chạy ở chế độ **KRaft (không cần ZooKeeper)**.

#### File `docker-compose.yml`

```yaml
version: '3.8'

services:
  kafka1:
    image: apache/kafka:latest
    container_name: kafka1
    ports:
      - "9092:9092"
    environment:
      KAFKA_NODE_ID: 1
      KAFKA_PROCESS_ROLES: 'broker,controller'
      KAFKA_CONTROLLER_QUORUM_VOTERS: '1@kafka1:29093,2@kafka2:29093,3@kafka3:29093'
      KAFKA_LISTENERS: 'PLAINTEXT://:29092,CONTROLLER://:29093,PLAINTEXT_HOST://:9092'
      KAFKA_ADVERTISED_LISTENERS: 'PLAINTEXT://kafka1:29092,PLAINTEXT_HOST://localhost:9092'
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: 'CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT'
      KAFKA_CONTROLLER_LISTENER_NAMES: 'CONTROLLER'
      KAFKA_INTER_BROKER_LISTENER_NAME: 'PLAINTEXT'
      CLUSTER_ID: 'MkU3OEVBNTcwNTJENDM2Qk'
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 3 # Tăng lên 3 để an toàn dữ liệu
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: 'false'

  kafka2:
    image: apache/kafka:latest
    container_name: kafka2
    ports:
      - "9093:9093"
    environment:
      KAFKA_NODE_ID: 2
      KAFKA_PROCESS_ROLES: 'broker,controller'
      KAFKA_CONTROLLER_QUORUM_VOTERS: '1@kafka1:29093,2@kafka2:29093,3@kafka3:29093'
      KAFKA_LISTENERS: 'PLAINTEXT://:29092,CONTROLLER://:29093,PLAINTEXT_HOST://:9093'
      KAFKA_ADVERTISED_LISTENERS: 'PLAINTEXT://kafka2:29092,PLAINTEXT_HOST://localhost:9093'
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: 'CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT'
      KAFKA_CONTROLLER_LISTENER_NAMES: 'CONTROLLER'
      KAFKA_INTER_BROKER_LISTENER_NAME: 'PLAINTEXT'
      CLUSTER_ID: 'MkU3OEVBNTcwNTJENDM2Qk'
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 3
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: 'false'

  kafka3:
    image: apache/kafka:latest
    container_name: kafka3
    ports:
      - "9094:9094"
    environment:
      KAFKA_NODE_ID: 3
      KAFKA_PROCESS_ROLES: 'broker,controller'
      KAFKA_CONTROLLER_QUORUM_VOTERS: '1@kafka1:29093,2@kafka2:29093,3@kafka3:29093'
      KAFKA_LISTENERS: 'PLAINTEXT://:29092,CONTROLLER://:29093,PLAINTEXT_HOST://:9094'
      KAFKA_ADVERTISED_LISTENERS: 'PLAINTEXT://kafka3:29092,PLAINTEXT_HOST://localhost:9094'
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: 'CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT'
      KAFKA_CONTROLLER_LISTENER_NAMES: 'CONTROLLER'
      KAFKA_INTER_BROKER_LISTENER_NAME: 'PLAINTEXT'
      CLUSTER_ID: 'MkU3OEVBNTcwNTJENDM2Qk'
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 3
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: 'false'

  kafka-ui:
    image: provectuslabs/kafka-ui:latest
    container_name: kafka-ui
    ports:
      - "8080:8080"
    depends_on:
      - kafka1
      - kafka2
      - kafka3
    environment:
      # Kết nối Kafka UI với service 'kafka' bên trên
      KAFKA_CLUSTERS_0_NAME: local
      KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS: kafka1:29092,kafka2:29092,kafka3:29092
      DYNAMIC_CONFIG_ENABLED: 'true'

```

Giải thích một số properties trong docker compose :
### 1. Định danh và Vai trò (Identification & Roles)

#### KAFKA_NODE_ID: 1
* ID duy nhất của broker trong cụm.
* Các node khác phải là 2, 3...
* Nó thay thế cho broker.id trước đây.

#### KAFKA_PROCESS_ROLES: 'broker,controller'
* Xác định node này làm nhiệm vụ gì.
* broker: Lưu trữ dữ liệu và xử lý yêu cầu từ client.
* controller: Quản lý cụm (thay thế vai trò của Zookeeper). Một node có thể làm cả hai.

📌 Có 3 kiểu:
* broker
* controller
* broker,controller (phổ biến cho dev)

#### CLUSTER_ID: 'MkU3OEVBNTcwNTJENDM2Qk'
* ID của cả cụm.
* Tất cả các broker trong cùng một cụm phải dùng chung ID này để chúng nhận diện được nhau.
---
### 2. Cơ chế Bầu chọn (Quorum Configuration)

#### KAFKA_CONTROLLER_QUORUM_VOTERS: '1@kafka1:29093,2@kafka2:29093,3@kafka3:29093'
* Danh sách các node có quyền biểu quyết để bầu ra "Leader" quản lý cụm.
* Định dạng là node_id@host_name:port_controller.
* Đây là cách các controller tìm thấy nhau để duy trì sự ổn định của cụm.

### 3. Mạng và Kết nối (Listeners) - Đây là phần dễ gây nhầm lẫn nhất:

#### KAFKA_LISTENERS: 'PLAINTEXT://:29092,CONTROLLER://:29093,PLAINTEXT_HOST://:9092'

- Khai báo các "cổng" mà Kafka sẽ mở ra để lắng nghe.

    * PLAINTEXT://:29092: Cho các broker khác hoặc app trong Docker (Broker nội bộ (container ↔ container))
    * CONTROLLER://:29093: Chỉ dành cho các controller trao đổi thông tin bầu chọn.
    * PLAINTEXT_HOST://:9092: Cho các ứng dụng chạy bên ngoài Docker (localhost).
- Listener chỉ là cổng mở, chưa phải địa chỉ client thấy

#### KAFKA_ADVERTISED_LISTENERS: 'PLAINTEXT://kafka3:29092,PLAINTEXT_HOST://localhost:9092'

* Địa chỉ mà Kafka "quảng bá" ra ngoài.
* Khi client kết nối tới Kafka, Kafka sẽ gửi lại địa chỉ này để bảo client hãy liên lạc qua đó.
* Client ngoài Docker sẽ dùng localhost:9092.
* Client trong Docker (như Kafka UI) sẽ dùng kafka1:29092.

#### KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: 'CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT'
* Định nghĩa giao thức bảo mật cho từng tên listener.
* Ở đây tất cả đều là PLAINTEXT (không mã hóa).
* Nếu dùng SSL/SASL thì config tại đây

### 4. Giao tiếp nội bộ (Internal Communication)

#### KAFKA_CONTROLLER_LISTENER_NAMES: 'CONTROLLER':
* Chỉ định listener nào được dùng cho mục đích quản lý cụm (controller).
* Bắt buộc trong KRaft mode

#### KAFKA_INTER_BROKER_LISTENER_NAME: 'PLAINTEXT':
* Chỉ định listener nào được các broker dùng để sao chép dữ liệu qua lại với nhau.
* Listener dùng cho:
    * Broker ↔ Broker
    * Replication
    * Metadata sync
* Không phải client listener

### 5. Cấu hình hệ thống và Dữ liệu

#### KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 3:
* Kafka lưu vị trí (offset) đã đọc của các Consumer trong một topic nội bộ. Khi có 3 broker, ta đặt là 3 để nếu 2 broker chết, ta vẫn không mất dấu vết đang đọc đến đâu.

#### KAFKA_AUTO_CREATE_TOPICS_ENABLE: 'false':
* Tắt tính năng tự tạo topic để kiểm soát chặt chẽ hệ thống.

#### KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: 1 & REPLICATION_FACTOR: 1:
* Cấu hình cho các bản ghi giao dịch (transactions).
* Trong môi trường 3 broker, bạn nên nâng REPLICATION_FACTOR lên 3 để đồng bộ với số lượng broker.

--- 
Tóm tắt luồng đi của dữ liệu:

* Spring Boot (ngoài Docker) nhìn thấy localhost:9092 (PLAINTEXT_HOST).
* Kafka UI (trong Docker) nhìn thấy kafka1:29092 (PLAINTEXT).
* Các Broker bầu chọn lẫn nhau qua cổng 29093 (CONTROLLER).

## Khởi động Kafka
```bash
docker-compose up -d
```
