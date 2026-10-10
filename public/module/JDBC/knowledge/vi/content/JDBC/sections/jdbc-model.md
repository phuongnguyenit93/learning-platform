```text
Java application
      ↓
JDBC API
      ↓
JDBC Driver
      ↓
Relational Database
```

Flow thường gặp:

```text
DataSource / DriverManager
→ Connection
→ PreparedStatement
→ ResultSet
→ map result
→ close resources
```
