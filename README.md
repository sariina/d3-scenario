# scenario

*this is a work in progress*

Glue d3.js charts and animations together based on definable scenario.

# Usage

- Clone the repository (or install via bower)
- `bower install` inside the root
- create a HTML file and include d3.js and scenario.js in headers like below:
```html
<script src="../src/vendors/d3/d3.js"></script>
<script src="../src/js/d3_scenario.js"></script>
```
- initialize your scenario
```javascript
     
      scenario.init({
          speed:2, // multiplies animation speeds in miliseconds 
          w: 1024, // width of main svg
          h: 768 // height of main svg
      });
```
- create your scenario by adding `Scenes` - read below or look at `example` folder 

### Scenes

A `Scenario` is collection of `Scenes`. each `Scene` can be one the following types:

- **1.Simple**: a simple promisifed function,you are free to define multiple steps inside it, each steps should call the next step and the main function should be inside of a Promise.
```javascript
function my_simple_scene(){
        return new Promise(function(resolve,reject){
            var container = scenario.svg.append("g")
                .attr("transform", "translate(" + scenario.w/2 + "," + scenario.h/2 + ")");
            rect = container.append("rect")
                .attr("width",100)
                .attr("height",100)
                .attr("fill","red");

            rect.transition().duration(scenario.t(500))
                .attr("width",300)
                .call(endAll,resolve);
        });
}
```
- **2.Heartbeat**: a class that returns an object consisting of three main methods, promisifed `start`, recurcive `heartbeat` and promisifed `end`. `start` and `end` are just like **Simple** scene type. and heartbeat is meant to run in an infinite loop by calling iteself. heartbeat will end by a `mousedown` event, `Scenario` takes care of ending it.
```javascript
function my_heartbeat_scene(){
        var scene = {};
        scene.start =  function(){
            return new Promise(function(res,rej){
                scene.rect = {};
                var container = scenario.svg.append("g")
                    .attr("transform", "translate(" + scenario.w/2 + "," + scenario.h/2 + ")");
                scene.rect = container.append("rect")
                    .attr("width",100)
                    .attr("height",100)
                    .attr("fill","red")
                scene.rect.transition()
                    .duration(scenario.t(500))
                    .attr("width",400)
                    .attr("height",400)
                    .call(endAll,res);
            });
        };
        scene.heartbeat = function(){
            scene.rect.transition()
                .duration(scenario.t(1000))
                .attr("width",200)
                .attr("height",200)
                .call(endAll,function(){
                    scene.rect.transition()
                    .duration(1000)
                    .attr("width",100)
                    .attr("height",100)
                    .call(endAll,scene.heartbeat);
                });
        };
        scene.end = function(){
            return new Promise(function(res,rej){
                scene.rect.transition().
                    duration(scenario.t(500))
                    .attr("width",0)
                    .attr("height",0)
                    .call(endAll,function(){
                        scene.rect.remove();
                        res();
                    });
            });
        };
        return scene;
    }
```
- **3.Parallel**: multiple **Simple** scene running toghere in parallel, when all function's promises resolved the scene is complete. it should be defined as an array
```javascript
var my_parallel_scene = [my_simple_scene1,my_simple_scene2];
```

### Adding Scenes to scenario

add your created scenes:
```javascript
scenario.add_scene(my_simple_scene);
scenario.add_scene(my_heartbeat_scene);
scenario.add_scene(my_parallel_scene);
```
### Start your scenario
`scenario.start()`
