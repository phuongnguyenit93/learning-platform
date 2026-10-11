Prefer evidence in the rough order **low impact → focused → invasive**:

~~~text
existing logs / metrics
        ↓
jcmd information / thread snapshot / JMX
        ↓
default or continuous JFR
        ↓
histogram / focused recording
        ↓
heap dump / core dump / invasive attach
~~~

Cost is not only CPU overhead. Consider pause time, disk/network volume, risk of worsening memory pressure, data sensitivity, operator time, and whether unique evidence will disappear if collection is delayed.

Sometimes a heavy artifact must be captured immediately—for example, before an unavoidable restart or during a rare OOME. “Low impact first” should not destroy evidence that cannot be reproduced.
