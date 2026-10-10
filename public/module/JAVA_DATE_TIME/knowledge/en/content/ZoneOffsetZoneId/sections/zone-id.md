`ZoneId` can represent either a fixed-offset zone or a named region. When the domain needs rules that can vary across history or policy, region-based values look like:

```java
ZoneId vietnam = ZoneId.of("Asia/Ho_Chi_Minh");
ZoneId paris = ZoneId.of("Europe/Paris");
ZoneId newYork = ZoneId.of("America/New_York");
```

The region name is not merely a display label. It lets Java consult the region's **time-zone rule set**.

### Avoid ambiguous short zone IDs

Three-letter abbreviations such as `CST`, `EST`, or `IST` look convenient but are **not reliable globally unique region identities**; the same abbreviation can be interpreted differently across systems or regions. For real domain data, prefer IANA-style `Area/City` IDs such as:

```text
Asia/Ho_Chi_Minh
Europe/Paris
America/New_York
```

Java exposes compatibility mappings such as `ZoneId.SHORT_IDS`, and the legacy `TimeZone` API also recognizes many short IDs. This is a separate compatibility mechanism; it does not mean a one-argument call such as `ZoneId.of("EST")` is generally valid. Prefer clear region IDs as canonical business data when the contract can store or exchange a `ZoneId`.

Compare:

```text
+01:00
→ one concrete offset

Europe/Paris
→ region identity
→ rules can determine the correct offset for a given date/instant
```

Because of daylight-saving transitions or legal changes, one region can use different offsets at different times of year or history.

**DST (Daylight Saving Time)** is a policy used by some regions to move the local clock during part of the year. Not every country or region uses DST, and governments can change the rules, so code should not hard-code assumptions such as “summer always means +1 hour.”

### Choose ZoneOffset or ZoneId?

```text
An external contract owns only one concrete offset such as +07:00
→ ZoneOffset

The domain owns a real region and needs historical/future regional rules
→ region-based ZoneId

Only a global event point matters; local/zone identity does not
→ usually convert to Instant
```

Do not promote a `ZoneOffset` back into a regional `ZoneId` by guessing. `+07:00` can match many places and does not contain enough information to recover the original region.

### System default zone

```java
ZoneId systemZone = ZoneId.systemDefault();
```

This is convenient but introduces an environment dependency. The same code can behave differently on a laptop, CI machine, container, and production host when their default zones differ. If the domain knows its zone, pass or configure it explicitly rather than relying on a hidden default.
