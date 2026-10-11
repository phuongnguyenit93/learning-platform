Dynamic attach modifies a JVM **after deployment startup**, so its policy should be stricter and more explicit than a startup agent.

JDK 21 warns on dynamic agent loading in the direction established by JEP 451. The integrity model is:

~~~text
startup -javaagent
→ deployer opted in before application start

dynamic attach
→ runtime mutation on demand
→ requires explicit authorization
~~~

Production policy should define:

- which users/tools may attach;
- which environments allow it;
- alert/audit behavior;
- JVM flag configuration;
- fallback when future JDK defaults become stricter.

Do not build automation around the assumption that dynamic attach will remain unrestricted by default forever.
