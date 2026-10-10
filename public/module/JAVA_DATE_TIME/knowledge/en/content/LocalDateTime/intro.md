# LocalDateTime

`LocalDateTime` combines `LocalDate` and `LocalTime`: it knows **which date** and **what local clock time**, but deliberately contains no `ZoneId` or `ZoneOffset`.

That makes it useful, but it also makes it one of the easiest temporal types to misuse as a global timestamp.
