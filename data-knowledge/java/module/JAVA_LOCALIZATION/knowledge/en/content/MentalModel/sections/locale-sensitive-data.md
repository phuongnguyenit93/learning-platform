Not every value should change with `Locale`.

| Information | Canonical/domain representation | Locale-sensitive presentation |
| --- | --- | --- |
| numeric amount | `BigDecimal("1234567.89")` | `1.234.567,89` or `1,234,567.89` |
| currency | `Currency.getInstance("USD")` | `$`, `US$`, localized display name |
| point in time | `Instant` | localized date/time after choosing a zone |
| status | code/enum such as `PAID` | `Đã thanh toán` / `Paid` |
| message identity | `order.created` | translated message text |
| protocol identifier | stable machine string | normally locale-neutral |

A healthier domain model looks like:

```java
record Order(BigDecimal total, Currency currency, Instant createdAt) {}
```

Presentation receives separate context:

```java
Locale locale = Locale.forLanguageTag("vi-VN");
ZoneId zone = ZoneId.of("Asia/Ho_Chi_Minh");
```

and only then turns canonical values into text.

Storing formatted text as the primary domain value is usually a design smell:

```java
record Order(String total) {}

// "1.234.567,89 ₫"
```

That representation is harder to calculate with, harder to re-localize, and unsafe as a machine contract.

Use this mental model:

```text
canonical domain value
        ↓
stable business meaning
        ↓
presentation boundary
   + Locale
   + ZoneId when time-zone conversion is needed
   + Currency when money has a unit
        ↓
human-facing text
```

`Locale` is **not** a `ZoneId` and is **not** a `Currency`. These concepts can cooperate during presentation, but each has a separate responsibility.
