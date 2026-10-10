InetAddress is the JDK abstraction for an **IP address**. An instance represents either a 32-bit IPv4 or 128-bit IPv6 address and may also carry the corresponding host name. Most application code should work through InetAddress instead of branching directly on Inet4Address or Inet6Address.

For example:

~~~java
InetAddress address = InetAddress.getByName("example.com");

System.out.println(address.getHostAddress());
System.out.println(address.getHostName());
~~~

A host name and an IP address are not necessarily one-to-one. One host can resolve to multiple addresses, so getAllByName(...) can be more representative than getByName(...):

~~~java
for (InetAddress address : InetAddress.getAllByName("example.com")) {
    System.out.println(address.getHostAddress());
}
~~~

InetAddress does not include a port. When transport addressing is needed, Java combines host/IP information with a port in InetSocketAddress.

Do not treat isReachable() as an absolute service-health check. Reachability depends on network configuration, firewall policy, and implementation behavior. Application health is usually better observed through the application protocol itself.
