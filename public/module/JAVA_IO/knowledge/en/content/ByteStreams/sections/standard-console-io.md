`System.in`, `System.out`, and `System.err` are the process's **standard streams**. They give programs a conventional input/output boundary without requiring the code to know whether data is connected directly to a terminal, redirected from a file, or piped to or from another process.

```text
standard input   → System.in  → InputStream
standard output  → System.out → PrintStream
standard error   → System.err → PrintStream
```

When a program runs interactively, `System.in` may receive what a user types and `System.out` may display on the screen. The shell can also redirect exactly the same program:

```text
java App < input.txt > output.txt 2> error.txt
```

The Java code still uses `System.in/out/err`, but the actual sources and sinks have changed. **Standard I/O is therefore not the same thing as terminal I/O.** This is also why library code should normally avoid closing the standard streams: their lifetime belongs to the process/launcher, and closing `System.out` can break output from code that runs later.

For a program that specifically needs an interactive terminal, Java provides `java.io.Console`:

```java
java.io.Console console = System.console();

if (console != null) {
    String name = console.readLine("Your name: ");
    char[] password = console.readPassword("Password: ");

    if (name != null) {
        console.printf("Hello %s%n", name);
    }
    if (password != null) {
        java.util.Arrays.fill(password, '\0');
    }
}
```

`Console` provides terminal-oriented operations such as `readLine`, `printf`, `reader()`, `writer()`, and `readPassword()`. `readPassword()` attempts to suppress terminal echo and returns a `char[]` so the caller can overwrite sensitive characters after use. Both `readLine(...)` and `readPassword(...)` can return `null` when the console input reaches end-of-stream, so code must not dereference their results unconditionally.

The key boundary is that `System.console()` **may return `null`**. This is common when the JVM has no suitable interactive console, such as under some IDEs, test runners, services/background processes, or when standard streams are piped or redirected. Code therefore needs a fallback or another input abstraction instead of assuming a `Console` always exists.

`System.out`/`System.err` are `PrintStream` instances, while `Console.writer()` returns a `PrintWriter`. These print APIs are convenient for text, but their `print/println/printf` methods store I/O failure in an error state instead of propagating `IOException`; use `checkError()` when the caller must observe that failure.
