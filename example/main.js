var Main = (function(scenario){
    var my = {};
    my.scene2 = function(){
        return new Promise(function(res,rej){
            var container = scenario.svg.append("g")
                .attr("transform", "translate(" + scenario.w/2 + "," + scenario.h/2 + ")");
            rect = container.append("rect")
                .attr("width",100)
                .attr("height",100)
                .attr("fill","red");

            rect.transition().duration(scenario.t(500))
                .attr("width",300)
                .call(endAll,res);
        });
    };
    function Scene1(){
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
    function Scene2(){
        var scene = {};
        scene.start =  function(){
            return new Promise(function(res,rej){
                scene.rect = {};
                var container = scenario.svg.append("g")
                    .attr("transform", "translate(" + scenario.w/2 + "," + scenario.h/2 + ")");
                scene.rect = container.append("rect")
                    .attr("width",100)
                    .attr("height",100)
                    .attr("fill","green")
                scene.rect.transition()
                    .duration(scenario.t(500))
                    .attr("width",400)
                    .attr("height",400)
                    .call(endAll,res);
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
    my.init = function(){
        scenario.init({
            speed:2,
            w: 1024,
            h: 768
        });
        scenario.add_scene(new Scene1());
        scenario.add_scene(new Scene2());
        scenario.add_scene(my.scene2);
        scenario.start();
    };
    return my;
})(scenario);
