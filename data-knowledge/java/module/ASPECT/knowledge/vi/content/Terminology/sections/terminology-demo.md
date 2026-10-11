Controller:

```text
TerminologyController#inspectTerminology()
```

Endpoint:

```text
GET /aop/terminology/inspect
```

Target:

```text
TerminologyService#execute()
```

Advice:

```text
TerminologyAspect#explainTerms(...)
```

Response `facts` cho biết:

- object được inject có phải AOP proxy hay không;
- runtime class của object được inject;
- target class thật.

Response `events` còn ghi:

```text
aspect=TerminologyAspect
advice=@Before
join-point=...
proxy-class=...
target-class=TerminologyService
target:TerminologyService.execute
```
