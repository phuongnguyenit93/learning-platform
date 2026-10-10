# Class and Instance Initialization Order

Many construction bugs come from code that is correct in isolation but runs **earlier or later than expected**. Java defines a specific order for class initialization and per-instance initialization; keeping those two processes distinct also prevents the misconception that static initialization runs for every `new`.
