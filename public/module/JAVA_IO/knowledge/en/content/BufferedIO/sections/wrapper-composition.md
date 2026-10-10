A **wrapper** receives another stream, reader, or writer underneath it, adds one capability, and delegates the actual data movement downstream. Java therefore does not need one class for every possible combination such as “file input + UTF-8 decoding + line-oriented reads + buffering.”

```text
byte source
    ↓ FileInputStream
    ↓ InputStreamReader   — bytes to characters
    ↓ BufferedReader      — buffering + readLine()
application
```

Not every wrapper is a buffering wrapper. `DataInputStream` adds structured primitive reads, `InputStreamReader` adds charset decoding, and `BufferedInputStream` or `BufferedReader` adds buffering. When reading a wrapper chain, ask **what behavior each layer adds**, **how `close()` propagates through the chain**, and separately **which application scope owns responsibility for closing the underlying resource**.
