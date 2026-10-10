NetworkInterface represents a network interface visible to the JVM: Ethernet, Wi-Fi, loopback, virtual interfaces, or other interfaces exposed by the operating system.

It matters when code needs to:

- enumerate local addresses;
- choose an interface for multicast;
- inspect loopback/up/down state;
- avoid assuming that one machine has exactly one IP address.

Example:

~~~java
for (NetworkInterface nic :
        Collections.list(NetworkInterface.getNetworkInterfaces())) {

    System.out.println(nic.getName());

    for (InetAddress address : Collections.list(nic.getInetAddresses())) {
        System.out.println("  " + address.getHostAddress());
    }
}
~~~

Developer machines, container hosts, and cloud servers commonly expose several interfaces. Selecting the “first address” is therefore not a reliable machine-identity strategy.

NetworkInterface belongs in Networking because it affects binding, multicast, and local-address selection. It is not a model for network topology, routing policy, or service discovery.
