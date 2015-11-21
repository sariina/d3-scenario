# scenario

*this is a work in progress*

Glue d3.js charts and animations together based on definable scenario.
A `Scenario` is collection of `Scenes`. each `Scene` can be one the following types:

1. **Simple**: a simple function, however you are free to define multiple steps inside the function, each steps should call the next step and the main function should be inside of a Promise.
2. **Heartbeat**: consists of three functions, `start`, `heartbeat` and `end`, `start` and `end` are just like **Simple** scene. and heartbeat is meant to run forever by calling iteself at the end of its scene. heartbeat will end. by `mousedown` event
3. **Parallel**: multiple **Simple** scene running toghere in parallel, when all of theire Promises resolved the scene is complete.

# Usage
Look inside example folder.


