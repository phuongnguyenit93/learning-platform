# Legacy Interop and Date-Time Synthesis

`java.time` fixes many design problems in older date-time APIs, but real systems still encounter `java.util.Date`, `Calendar`, JDBC types, database columns, and machine defaults. Modern code therefore needs to interoperate without importing legacy mental models into the new design.
