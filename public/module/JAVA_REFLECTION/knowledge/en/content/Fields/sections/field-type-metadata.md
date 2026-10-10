A field can expose two layers of type information:

~~~java
private List<String> supportedCurrencies;
~~~

~~~java
Field field = PaymentService.class
        .getDeclaredField("supportedCurrencies");

Class<?> rawType = field.getType();
Type genericType = field.getGenericType();

System.out.println(rawType);
// interface java.util.List

System.out.println(genericType.getTypeName());
// java.util.List<java.lang.String>
~~~

getType() returns the runtime/raw Class<?>. It is appropriate for questions such as “is this field assignable to List?”.

getGenericType() returns java.lang.reflect.Type and can preserve declaration-signature metadata. For List<String>, it will commonly be a ParameterizedType rather than only the raw List Class.

~~~java
if (genericType instanceof ParameterizedType parameterized) {
    Type elementType = parameterized.getActualTypeArguments()[0];
    System.out.println(elementType.getTypeName());
}
~~~

With a type variable:

~~~java
class Box<T> {
    T value;
}
~~~

getType() reflects the erased runtime field type (typically Object when T has no narrower bound), while getGenericType() can return a TypeVariable representing T.

This does not mean every object carries all of its generic type arguments at runtime. Java still uses erasure for execution; Reflection is reading **generic signature metadata retained on declarations**. `ParameterizedType`, `TypeVariable`, `WildcardType`, and `GenericArrayType` are covered in depth by **Generic Signature Metadata after Erasure**.

Field reflection therefore connects three metadata layers:

~~~text
Runtime Type Model
→ overall type/member structure

Field
→ state descriptor + type/modifier/signature metadata

Generic Signature Metadata after Erasure
→ richer declaration signatures when Class<?> is not enough
~~~

With field discovery covered, the next part of **Discovering Class Members** is behavior metadata: **how does runtime code find the right `Method` and understand its signature before invoking it?**
