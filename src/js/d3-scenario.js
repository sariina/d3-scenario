/* jshint expr: true */
!function(d3){

    var TYPE_SCENE = 0;
    var TYPE_HEARTBEAT = 1;
    var TYPE_PARALLEL = 2;

    var my = {
        w : 800,
        h : 800,
        speed: 1,
        scenes: []
    };


    my.t = function(t){
        return t/Math.max(1,my.speed);
    };

    my.init = function(options){
        extend(my,options || {});
        my.svg = d3.select("svg")
            .attr("width",my.w)
            .attr("height",my.h);
    };

    /**
     * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
     * @param obj1
     * @param obj2
     * @returns obj3 a new object based on obj1 and obj2
     */
    function extend(obj1,obj2){
        for (var attrname in obj2) { obj1[attrname] = obj2[attrname]; }
    }

    /**
     * Calls a function at the end of **all** transitions.
     * @param {d3.transition} transition A D3 transition
     * @param {Function}      callback   The function to be called at the end of **all** transitions
     */
    function endAll (transition, callback) {
        var n;

        if (transition.empty()) {
            callback();
        }
        else {
            n = transition.size();
            transition.each("end", function () {
                n--;
                if (n === 0) {
                    callback();
                }
            });
        }
    }

    function timer(delay){
        return new Promise(function(start,reject){
            setTimeout(function(){
                start();
            },delay);
        });
    }

    function my_mousedown_to_continue(waitfor){
        return new Promise(function(res,rej){
            d3.select("body").on("mousedown",function(){
                console.log("here");
                res();
            });
        });
    }


    // adds scene function to my
    my.add_scene = function(scene){
        switch(Object.prototype.toString.call(scene)){
            case '[object Array]': 
                my.scenes.push({type:TYPE_PARALLEL, scene: scene});
                break;
            case '[object Object]':
                if(Object.prototype.toString.call(scene.start) === '[object Function]'){
                    my.scenes.push({type:TYPE_SCENE, scene: scene.start});
                }
                if(Object.prototype.toString.call(scene.heartbeat) === '[object Function]'){
                    my.scenes.push({type: TYPE_HEARTBEAT, scene: { waitfor: my_mousedown_to_continue, heartbeat: scene.heartbeat}});
                }
                if(Object.prototype.toString.call(scene.end) === '[object Function]'){
                    my.scenes.push({type:TYPE_SCENE, scene: scene.end});
                }
                break;
            case '[object Function]':
                my.scenes.push({type:TYPE_SCENE, scene: scene});
                break;
            default:
                throw "scene should be a function";
        }
    };

    my.start = function(){
        return my.scenes.reduce(function(cur, next,index) {
            if( next.type == TYPE_PARALLEL ) {
                // go to next step when all promises are resolved
                return cur.scene.then(function(){
                    var promises = next.scene.map(function(p){
                        return p();
                    });
                    return Promise.all(promises);
                });
            }else if(next.type == TYPE_HEARTBEAT) {
                // recursive heartbeat until waitfor is resolved
                return cur.then(function(){
                    // due to variable logics, heartbeat should handle recursiveness itself
                    next.scene.heartbeat();
                return next.scene.waitfor();
                });
            }else if(next.type == TYPE_SCENE){
                return cur.then(next.scene);
            }
        }, Promise.resolve()).then(function(){
            //location.hash = "#scene0";
            //location.reload();
        }).then(null,function(e){
            console.error(e);
        });
    };
    this.scenario = my;
    this.timer = timer;
    this.endAll = endAll;
}(d3);
