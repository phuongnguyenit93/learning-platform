Trích xuất dữ liệu từ MongoDB Atlas thông qua CLI bằng Docker hoặc Database Tool là kỹ thuật quan trọng giúp bạn chủ động quản lý bản sao lưu mà không phụ thuộc hoàn toàn vào Cloud.

## 1. Sử dụng MongoDB Database Tools (Cài trực tiếp)
Đây là cách dùng lệnh `mongodump` thuần túy từ terminal sau khi bạn đã cài đặt bộ công cụ Database Tools trên máy host.

```bash
	mongodump --uri="mongodb+srv://<db_username>:<db_password>@<db_host>/<db_database>?appName=<app_name>" --out="<backup_path>/full_backup_<timestamp>"
```
* **Lưu ý:** Với Atlas, bạn chỉ cần trỏ đến Cluster Host để dump tất cả hoặc thêm `<db_database>` vào sau dấu `/` để chỉ định đích danh một database.

## 2. Sử dụng Docker (CLI qua Container)
Cách này cực kỳ hữu hiệu vì bạn không cần cài đặt thêm bất kỳ công cụ nào lên Windows/Mac, giúp giữ máy host luôn "sạch".

**Đối với Windows (PowerShell/CMD):**
```powershell
    docker run --rm `
      -v "<local_path_to_backup>:/backup" `
      mongo:latest `
      mongodump --uri="mongodb+srv://<db_username>:<db_password>@<db_host>/<db_database>" --out="/backup"
```

**Đối với Linux/macOS:**
```bash
    docker run --rm \
      -v "<local_path_to_backup>:/backup" \
      mongo:latest \
      mongodump --uri="mongodb+srv://<db_username>:<db_password>@<db_host>/<db_database>" --out="/backup"
```

## 3. Tích hợp vào Gradle Task (Tự động hóa)
Trong project `java-learning`, bạn nên định nghĩa các biến trong `gradle.properties` hoặc `.env` để task tự động xử lý.

```gradle
	task backupAtlasGeneral(group: "database") {
	    doLast {
	        def dbUser = project.findProperty("mongo.user") ?: "<db_username>"
	        def dbPass = project.findProperty("mongo.pass") ?: "<db_password>"
	        def dbHost = project.findProperty("mongo.host") ?: "<db_host>"
	        def dbName = project.findProperty("mongo.db")   ?: "<db_database>"
	        def timestamp = java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"))

	        def localExportDir = "${project.rootDir}/backup/mongo/dump_${timestamp}"
	        file(localExportDir).mkdirs()

	        exec {
	            commandLine 'docker', 'run', '--rm', 
	                '-v', "${localExportDir}:/data_dump", 
	                'mongo:latest', 
	                'mongodump', 
	                '--uri', "mongodb+srv://${dbUser}:${dbPass}@${dbHost}/${dbName}", 
	                '--out', '/data_dump'
	        }

	        println "--------------------------------------------------"
	        println ">>> BACKUP COMPLETED | Location: ${localExportDir}"
	        println "--------------------------------------------------"
	    }
	}
```

---

## 🔍 Giải thích các tham số (Placeholders)

| Tham số | Ý nghĩa | Ví dụ |
| :--- | :--- | :--- |
| **<db_username>** | Tên người dùng database. | `admin` |
| **<db_password>** | Mật khẩu (cần encode ký tự đặc biệt). | `P@ssw0rd123` |
| **<db_host>** | Địa chỉ Cluster Atlas. | `cluster0.abcde.mongodb.net` |
| **-v (Volume)** | Ánh xạ thư mục máy thật vào `/backup` của Docker. | `C:/backups:/backup` |

### 💡 Lưu ý bảo mật:
Khi sử dụng tham số `--uri` chứa mật khẩu, hãy cẩn thận với lịch sử lệnh (`history`) trên Terminal. Sử dụng tệp cấu hình hoặc biến môi trường là cách an toàn hơn để bảo vệ thông tin đăng nhập của bạn.
