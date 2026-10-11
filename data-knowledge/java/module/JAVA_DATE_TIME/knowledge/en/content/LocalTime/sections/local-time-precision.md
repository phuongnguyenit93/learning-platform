`LocalTime` can hold:

```text
hour
minute
second
nano-of-second
```

```java
LocalTime precise = LocalTime.of(9, 30, 15, 123_456_789);
```

This means the type can **represent** nanoseconds. It does not mean the operating system, hardware clock, database, or upstream source measured the event accurately to a nanosecond.

```text
representation precision
≠
measurement accuracy/resolution
```

Persistence boundaries matter too. A database column that supports only microseconds or milliseconds may truncate finer precision.

Useful constants and field access:

```java
LocalTime midnight = LocalTime.MIDNIGHT;
LocalTime noon = LocalTime.NOON;

int hour = precise.getHour();
int minute = precise.getMinute();
int second = precise.getSecond();
int nano = precise.getNano();
```
