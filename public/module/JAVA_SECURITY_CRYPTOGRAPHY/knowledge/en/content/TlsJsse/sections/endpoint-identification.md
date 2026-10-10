Trusting a certificate path is not enough; a client also needs **endpoint identity verification**.

`SSLParameters` supports endpoint-identification configuration for relevant JSSE clients. For example, an `SSLSocket` client can request HTTPS-style hostname verification:

~~~java
SSLParameters parameters = socket.getSSLParameters();
parameters.setEndpointIdentificationAlgorithm("HTTPS");
socket.setSSLParameters(parameters);
~~~

When the algorithm is non-null/non-empty, endpoint identification must be handled during the TLS handshake. Higher-level HTTP clients commonly configure HTTPS hostname-verification behavior for their own use case.

SNI and endpoint verification are related but different. SNI tells the server which name the client is trying to reach; endpoint verification checks whether the peer certificate actually represents that target.

Do not solve development-certificate problems in production by installing a trust-all manager or disabling hostname checks. For tests, create explicit test trust material instead of globally removing verification.
