SSLContext is a factory/state holder for secure-protocol implementations. It is initialized with `KeyManager[]`, `TrustManager[]`, and `SecureRandom`:

~~~java
SSLContext context = SSLContext.getInstance("TLS");
context.init(keyManagers, trustManagers, secureRandom);
~~~

A **KeyManager** chooses local authentication credentials to present to the peer. A **TrustManager** decides whether remote authentication credentials should be trusted.

These roles are not simply “server versus client.” With mutual TLS, both peers may present an identity and validate the other side.

For `null`, distinguish the **Java SE API contract** from the JDK behavior documented by Oracle's JSSE guide:

- at the `SSLContext.init(...)` API level, a `null` `KeyManager[]` or `TrustManager[]` allows the runtime to search installed security providers for the highest-priority implementation of the corresponding factory; `SecureRandom == null` allows a default implementation;
- Oracle's JSSE Reference Guide for the JDK documents `KeyManager[] == null` as defining an empty `KeyManager` for the context, while `TrustManager[] == null` uses the default `TrustManagerFactory` to obtain an appropriate `TrustManager`.

Do not collapse these cases into one vague “use defaults” rule, and do not interpret `null` as disabling certificate or trust validation. If application behavior depends on default resolution, verify the provider/JDK behavior being deployed.
