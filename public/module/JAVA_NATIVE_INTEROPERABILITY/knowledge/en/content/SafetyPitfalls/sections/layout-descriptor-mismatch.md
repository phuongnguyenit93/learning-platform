Three contracts must agree: the **MemoryLayout of the data**, the **FunctionDescriptor of the call**, and the **ABI of the native binary**.

Dangerous mismatches include:

- a struct layout missing required padding;
- a pointer parameter described as an integer;
- a function returning a struct while the descriptor models a scalar;
- a binary using a different calling convention;
- code generated from header version A while runtime loads library version B.

Some mismatches are caught by Java or Linker validation, but not all of them. A native function pointer does not carry enough type information for the runtime to prove that the descriptor is correct.

Bindings should therefore include boundary tests with known values: verify structure size and offsets, write data on one side and read it on the other, and exercise the exact library version that will be deployed.
