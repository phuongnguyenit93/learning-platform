Continuous recording turns JFR into a “black box recorder” for rare failures.

A common pattern:

~~~text
JVM starts
→ JFR runs continuously with default settings
→ maxage/maxsize bounds retention
→ incident occurs
→ dump before restart
→ analyze the period immediately before the incident
~~~

This is valuable because the exact failure time does not have to be predicted in advance.

Example startup configuration:

~~~text
-XX:StartFlightRecording=name=continuous,settings=default,disk=true,maxage=2h,maxsize=512m
~~~

Capacity and retention still matter. Recordings may expose class/method names, file paths, application context, or custom event data, so treat them as production diagnostic artifacts.
