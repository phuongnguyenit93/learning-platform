A runtime incident is not solved efficiently by “running every tool and looking for something strange.” That produces data without a disciplined argument. A useful workflow forces the investigation through a sequence:

~~~text
What is the symptom?
        ↓
What question must be answered next?
        ↓
What is the cheapest evidence that can answer it?
        ↓
Which hypothesis does the result support or falsify?
        ↓
Do we need more evidence, a fix, or a handoff?
~~~

This structure reduces unnecessary invasive collection, limits confirmation bias, and creates a reasoning trail another engineer can review.

Tools are only mechanisms for collecting evidence. Every collection step should have a concrete question behind it.
