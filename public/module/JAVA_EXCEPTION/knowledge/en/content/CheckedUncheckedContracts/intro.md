# Checked and Unchecked Exception Contracts

After understanding `Throwable`, the next question is: **which failures become part of a method contract that the compiler forces callers to acknowledge?**

Checked versus unchecked is a classification about **compile-time rules**, not about whether a failure is “serious” or “minor”.
