# What Date-Time Means and Why Multiple Models Exist

Date and time look simple because people use calendars and clocks every day. In software, however, the phrase “store a time” can mean several very different things:

```text
A person's birthday
→ a calendar date

Store opening time 08:30
→ a wall-clock time

A meeting at 09:00 on 2026-10-05 in Hanoi
→ local date + local time + time-zone rules

The exact moment when a request reached a server
→ one unambiguous point on the global timeline
```

If all of those meanings are collapsed into one variable called `timestamp`, the code may still compile while the domain model is already wrong. The first goal of this module is therefore not memorizing classes; it is learning to ask **what kind of time does this problem actually mean?**

We will reuse a meeting/booking scenario throughout the module. A user chooses a local date and time, a location supplies time-zone rules, and the system may eventually need one globally comparable instant for persistence or communication.
