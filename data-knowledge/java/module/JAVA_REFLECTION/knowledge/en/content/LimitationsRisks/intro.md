# When Should Reflection Be Used?

Reflection solves a real problem: code can work with structure that becomes known only at runtime. That flexibility comes from moving several compiler guarantees into runtime logic. The design question is therefore not only “can reflection do this?” but “is this dynamic behavior worth the safety, coupling, and operational cost?”.

The risks in this chapter follow from the same mental model. Direct Java code references types and members through symbols the compiler understands; reflective code often moves through metadata, strings, `Class`, `Method`, `Field`, and `Object`, then performs its own runtime validation.
