Constructor<?> exposes metadata similar to Method, but a constructor has no return type:

~~~java
Constructor<PaymentService> constructor =
        PaymentService.class.getConstructor(String.class);

Class<PaymentService> owner = constructor.getDeclaringClass();
Class<?>[] parameterTypes = constructor.getParameterTypes();
Type[] genericParameterTypes = constructor.getGenericParameterTypes();
Class<?>[] exceptionTypes = constructor.getExceptionTypes();
int modifiers = constructor.getModifiers();
boolean varArgs = constructor.isVarArgs();
boolean synthetic = constructor.isSynthetic();
~~~

Parameter metadata is also available:

~~~java
for (Parameter parameter : constructor.getParameters()) {
    System.out.println(parameter.getName());
    System.out.println(parameter.getType());
}
~~~

As with method parameters, source-level names are only dependable when the build retains the relevant parameter-name metadata. Otherwise Reflection may expose generated names such as arg0 and arg1.

Framework code can build constructor-selection rules from metadata:

~~~java
static boolean acceptsProvider(Constructor<?> constructor) {
    return Arrays.equals(
            constructor.getParameterTypes(),
            new Class<?>[] {String.class}
    );
}
~~~

Constructors may also declare checked exceptions:

~~~java
public PaymentService(String provider)
        throws ConfigurationException {
    // ...
}
~~~

getExceptionTypes() exposes that declaration. If construction actually throws the exception, Constructor.newInstance(...) exposes it as the cause of InvocationTargetException.

Varargs constructors are represented with an array as the final parameter and `isVarArgs() == true`. At this point the learner has completed **discovery** for `Field`, `Method`, and `Constructor`; the next chapter uses those descriptors to read/write fields, invoke methods, and create objects at runtime.
