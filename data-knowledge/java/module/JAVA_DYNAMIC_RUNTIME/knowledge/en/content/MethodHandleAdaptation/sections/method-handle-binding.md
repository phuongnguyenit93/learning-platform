Binding fixes an argument in advance:

```java
Greeter greeter = new Greeter();

MethodHandle greet = ...; // (Greeter,String)String

MethodHandle bound =
        greet.bindTo(greeter); // (String)String
```

`insertArguments` generalizes this to a selected parameter position:

```java
MethodHandle fixedPrefix =
        MethodHandles.insertArguments(
                target,
                0,
                "INFO"
        );
```

`permuteArguments` can reorder or reuse incoming arguments according to a mapping:

```text
before: (A,B)R
after : (B,A)R
```

These adapters are useful when infrastructure code normalizes many target signatures to one internal calling convention.
