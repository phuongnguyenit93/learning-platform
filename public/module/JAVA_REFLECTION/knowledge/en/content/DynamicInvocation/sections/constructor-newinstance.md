After selecting a constructor descriptor:

~~~java
Constructor<PaymentService> constructor =
        PaymentService.class.getConstructor(String.class);

PaymentService service = constructor.newInstance("stripe");
~~~

This is the reflective counterpart of:

~~~java
PaymentService service = new PaymentService("stripe");
~~~

Constructor varargs have the same boundary already seen with `Method.invoke(...)`: Reflection sees `String...` as `String[]`, while `Constructor.newInstance(...)` itself also accepts `Object...`.

~~~java
class TagBundle {
    TagBundle(String... tags) {}
}

Constructor<TagBundle> tagsConstructor =
        TagBundle.class.getDeclaredConstructor(String[].class);

TagBundle bundle = tagsConstructor.newInstance(
        (Object) new String[] {"fast", "safe"}
);
~~~

The cast to `Object` makes the `String[]` **one constructor argument**. Without it, when the target constructor has only one `String...` parameter, Java can treat the array as the outer `Object...` argument array of `newInstance(...)`, spreading its elements into multiple reflective arguments. Reflection does not perform target-constructor varargs packing the way ordinary constructor-call syntax does.

The key difference is that the constructor can be selected from runtime metadata:

~~~java
static <T> T create(
        Class<T> type,
        Class<?>[] parameterTypes,
        Object[] arguments
) throws ReflectiveOperationException {
    Constructor<T> constructor =
            type.getDeclaredConstructor(parameterTypes);
    return constructor.newInstance(arguments);
}
~~~

A real framework typically validates constructor policy, accessibility, and dependency resolution before the newInstance(...) step.

Arguments may undergo the unboxing/primitive-widening conversions allowed by reflective invocation, but the caller still must supply a valid count and compatible types. Reflection is not a general-purpose parser or domain conversion layer.

Constructor.newInstance(...) should be preferred over the deprecated Class.newInstance(). The older API only targets a no-argument constructor and has a less useful exception contract. A Constructor descriptor represents the exact constructor selected and reports target failures through InvocationTargetException, just like Method.invoke(...).

Reflective construction **still executes the real constructor body**. It does not allocate an object while skipping initialization logic:

~~~java
public PaymentService(String provider) {
    if (provider == null || provider.isBlank()) {
        throw new IllegalArgumentException("provider is required");
    }
    this.provider = provider;
}
~~~

constructor.newInstance("") runs that validation.
