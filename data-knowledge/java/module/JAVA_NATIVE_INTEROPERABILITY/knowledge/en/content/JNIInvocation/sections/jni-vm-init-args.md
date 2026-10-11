An embedding application creates a JVM with `JavaVMInitArgs` and an array of `JavaVMOption` entries. The arguments include the requested JNI version and startup options.

```c
JavaVMOption options[1];
options[0].optionString = "-Djava.class.path=app.jar";

JavaVMInitArgs args;
args.version = JNI_VERSION_1_8;
args.nOptions = 1;
args.options = options;
args.ignoreUnrecognized = JNI_FALSE;
```

`JNI_GetDefaultJavaVMInitArgs` is part of the Invocation API for obtaining/validating default VM initialization information for a requested version.

Startup configuration belongs to the host lifecycle. Unsupported VM options, an invalid class path, or an unsupported requested JNI version can prevent the JVM from starting before application code runs.

Keep initialization options explicit and centrally owned by the host rather than scattering option strings throughout native code.
