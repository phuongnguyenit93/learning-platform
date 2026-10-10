A recording has a basic lifecycle:

~~~text
configure
   ↓
start
   ↓
record events
   ↓
dump / stop
   ↓
analyze
~~~

Start at JVM launch:

~~~text
java -XX:StartFlightRecording=filename=app.jfr,settings=default -jar app.jar
~~~

or on a running JVM:

~~~text
jcmd <pid> JFR.start name=incident settings=default
jcmd <pid> JFR.check
jcmd <pid> JFR.dump name=incident filename=incident.jfr
jcmd <pid> JFR.stop name=incident filename=incident-final.jfr
~~~

Dumping does not have to stop the recording, which is useful when you need an evidence window while continuous recording remains active.

Record the generated name/ID when starting a recording, especially when multiple recordings may exist in one JVM.
