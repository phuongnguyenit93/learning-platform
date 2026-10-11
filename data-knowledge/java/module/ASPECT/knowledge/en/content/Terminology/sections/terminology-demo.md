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

The response `facts` shows:

- whether the injected object is an AOP proxy;
- the runtime class of the injected object;
- the real target class.

The response `events` also records:

```text
aspect=TerminologyAspect
advice=@Before
join-point=...
proxy-class=...
target-class=TerminologyService
target:TerminologyService.execute
```
