# File and the Legacy Path Model

Streams answer “how does data move in or out?” Before opening a stream for a file, code also needs to refer to the file's location, name, **directory**, and **metadata** — descriptive information such as whether it exists, whether it is a file or directory, its size, or its modification time. `java.io.File` is Java's older API for that part of the problem.
