CertPathValidator validates a certification path with an algorithm such as PKIX.

~~~java
CertPathValidator validator = CertPathValidator.getInstance("PKIX");
PKIXParameters params = new PKIXParameters(trustAnchors);
params.setRevocationEnabled(true);

CertPathValidatorResult result =
        validator.validate(certPath, params);
~~~

This answers “does the path reach an accepted trust anchor and satisfy the validation policy?” The `TrustAnchor` is supplied separately through `PKIXParameters`, and PKIX results expose it separately from the `CertPath`. Path validation does not by itself answer whether the certificate represents the hostname the application intended to contact.

Trust anchors are local policy inputs. If an attacker can modify the trust store and add a new CA, cryptographic path validation may still succeed under the compromised policy.
