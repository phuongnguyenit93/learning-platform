Widening primitive conversion usually moves to a representation with broader range and often needs no explicit cast:

```java
int x = 10;
long y = x;
```

Narrowing conversion can lose information and normally requires a cast:

```java
long x = 1000L;
int y = (int) x;
```

A cast does not guarantee the value remains semantically valid for the domain.

Widening is a language conversion category, not a universal precision guarantee:

```java
long exact = 9_007_199_254_740_993L;
double approximate = exact;
```

Narrowing may change the value:

```java
int large = 130;
byte small = (byte) large; // -126
```

Compile-time constants also have special narrowing rules when the compiler can prove the value fits:

```java
byte a = 100;
int x = 100;
// byte b = x; // not allowed without a cast
```
