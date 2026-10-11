Static field initializers and static initializer blocks run during class initialization according to source/superclass ordering rules.

Static mutable state is shared across all instances, so it introduces more global coupling and concurrency concerns than ordinary instance state.
