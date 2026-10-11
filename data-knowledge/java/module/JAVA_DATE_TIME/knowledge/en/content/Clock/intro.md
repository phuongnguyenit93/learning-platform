# Clock and Testable Time

Time-dependent code often contains an invisible dependency: **the system clock at the instant the method executes**. If business logic calls `Instant.now()` or `LocalDate.now()` directly in many places, tests become tied to real time and are harder to make deterministic.

`Clock` exists to turn the source of “now” into an object that can be supplied explicitly.
