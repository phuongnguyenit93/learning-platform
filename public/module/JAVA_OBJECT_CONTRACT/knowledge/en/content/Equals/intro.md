# The equals Contract

Once identity and logical equality are separated, the next question is: **if a class defines when two objects are logically equal, which laws must `equals` obey?**

`equals` is not merely a boolean method. It is a contract that collections, frameworks, and caller code rely on when reasoning about objects.
