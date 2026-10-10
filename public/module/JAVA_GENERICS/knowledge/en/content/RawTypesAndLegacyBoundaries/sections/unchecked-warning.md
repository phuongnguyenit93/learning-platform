Raw use often leaves the compiler unable to prove type safety:

```java
List raw = new ArrayList<String>();
raw.add(123); // unchecked call warning
```

The warning is not cosmetic. It marks a point where a generic guarantee is being crossed without proof.

Java has a mechanism for suppressing compiler warnings, but the annotation syntax belongs to the Annotation module. The important lesson here is: **do not hide a warning before understanding why the compiler cannot prove type safety**.

First ask:

- which legacy boundary caused the warning;
- whether the API can be parameterized instead;
- if a cast is unavoidable, what runtime condition makes it safe.
