# Stream Wrappers, Buffering, and Flush Semantics

The previous chapters already have streams that can move data. Two practical questions remain: how does Java add behavior to an existing I/O abstraction, and why do many tiny I/O operations often need buffering? The common answer is **wrapper composition**, with buffering as one important use of that model.
