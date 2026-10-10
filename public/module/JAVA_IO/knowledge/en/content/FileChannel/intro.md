# FileChannel and Advanced File I/O

`FileChannel` is a file-oriented channel. It still moves bytes through `ByteBuffer`, but it also has a **file position**, positional operations, channel-to-channel transfer, file locking, and memory mapping. This is where the Buffer/Channel model from the previous chapter enables capabilities that a purely sequential stream does not express directly.

~~~java
Path file = Files.createTempFile("channel-demo-", ".txt");

try (FileChannel channel = FileChannel.open(
        file,
        StandardOpenOption.READ,
        StandardOpenOption.WRITE
)) {
    // work with the channel
}
~~~
