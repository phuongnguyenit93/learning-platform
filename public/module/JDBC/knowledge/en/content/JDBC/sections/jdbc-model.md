```text
Java application
      ↓
JDBC API
      ↓
JDBC Driver
      ↓
Relational Database
```

Typical flow:

```text
DataSource / DriverManager
→ Connection
→ PreparedStatement
→ ResultSet
→ map result
→ close resources
```
