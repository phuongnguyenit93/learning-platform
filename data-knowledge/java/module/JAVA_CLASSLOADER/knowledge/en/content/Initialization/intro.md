# Class Initialization Triggers and Failure

Loading and linking prepare a class for use without necessarily running its static setup. Initialization is the point at which the JVM executes that setup. This separation allows frameworks to inspect or stage types without automatically performing every static side effect they contain.

Initialization is also a concurrency and failure boundary: the JVM coordinates it so a particular runtime class is initialized once, and a failed initialization leaves that class in an erroneous state.
