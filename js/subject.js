/**
 * Created by zhoubinbin on 2016/9/22.
 * 题目管理的js模块
 */
angular.module("app.subject",["ng"])
    //删除题目的控制器
    .controller("subjectDelController",["subjectService","$routeParams","$location",
        function (subjectService,$routeParams,$location) {
            var flag = confirm("确认删除吗？");
            if(flag){
                var id = $routeParams.id;
                subjectService.delSubject(id,function (data) {
                    alert(data);
                    //删除成功后页面跳转回题目列表页
                    $location.path("/AllSubject/a/0/b/0/c/0/d/0");
                });
            } else {
                $location.path("/AllSubject/a/0/b/0/c/0/d/0");
            }

    }])
    //审核题目的控制器
    .controller("subjectCheckController",["subjectService","$routeParams","$location",
        function (subjectService,$routeParams,$location) {
                var id = $routeParams.id;
                var state = $routeParams.state;
                //console.log(state);
                subjectService.checkSubject(id,state,function (data) {
                    alert(data);
                    $location.path("/AllSubject/a/0/b/0/c/0/d/0");
                });
    }])
    .controller("subjectController",["$scope","commonService","subjectService","$routeParams","$location",
        function ($scope,commonService,subjectService,$routeParams,$location) {
        //将路由参数绑定到作用域当中
            $scope.params = $routeParams;
            //添加题目页面下拉框信息数据
            $scope.subject = {
                typeId :1,
                levelId:1,
                departmentId:1,
                topicId:1,
                stem:"",
                answer:"",
                analysis:"",
                choiceContent:[],
                choiceCorrect:[false,false,false,false]
            };
            //保存并继续
            $scope.submit = function () {
                subjectService.saveSubject($scope.subject,function (data) {
                   alert(data);     //数据库中的提示消息
                });
                var subject = {
                    typeId :1,
                    levelId:1,
                    departmentId:1,
                    topicId:1,
                    stem:"",
                    answer:"",
                    analysis:"",
                    choiceContent:[],
                    choiceCorrect:[false,false,false,false]
                };
                //保存并继续，页面原有内容重置，这里使用的是将原有的内容再重新设置一遍，利用到一个angular方法copy(),
                // 将原先的值重新定义一次，再绑定在$scope.subject上
                //重置作用域中绑定的表单默认值
                angular.copy(subject,$scope.subject);   //将重新定义的subject拷贝到$scope.subject上
            };

            //保存并关闭
            $scope.submitAndClose = function () {
                subjectService.saveSubject($scope.subject,function (data) {
                    alert(data);
                });
                //保存并关闭，利用路由机制，手动设置一个path，让其跳转到subjectList页面
                $location.path("/AllSubject/a/0/b/0/c/0/d/0");
            };

            //调用获取类型函数
            commonService.getSubjecttypes(function (data) {
                $scope.types = data;
            });
            //调用获取方向函数
            commonService.getSubjectdepartments(function (data) {
                $scope.departments = data;
            });
            //调用获取知识点函数
            commonService.getSubjecttopics(function (data) {
                $scope.topics = data;
            });
            //调用获取难度函数
            commonService.getSubjectlevel(function (data) {
                $scope.levels = data;
            });
            //调用所有题目信息
            subjectService.getAllSubject($routeParams,function (data) {
                //对每个题目进行遍历
                data.forEach(function (subject) {
                    //为每个选项添加ABCD编号
                    if(subject.subjectType != null){
                        //对每个选择题里面的选项进行遍历
                        if(subject.subjectType.id != 3){
                            var answer = [];
                            subject.choices.forEach(function (choice,index) {
                                //给选项组数里面的每一个选项设置一个属性no，调用一个方法将索引值转换为对应的ABCD
                                choice.no = commonService.convertIndexToNo(index);
                            });
                            //如果题目类型id不为3，也就是为单选或者多选的时候
                            if(subject.subjectType.id != 3){
                                subject.choices.forEach(function (choice) {
                                    //如果选项的值为true则将序号添加进数组中
                                    if(choice.correct){
                                        answer.push(choice.no);
                                    }
                                });
                                //将数组转化为字符串格式
                                subject.answer = answer.toString();
                            }
                        }
                    }

                });
                $scope.subjects = data;
            });
    }])
    //获取全部题目的信息，创建一个新的服务，方便之后的增删该查，
    .service("subjectService",["$http","$httpParamSerializer",function ($http,$httpParamSerializer) {
        //删除题目
        this.delSubject = function(id,handler){
          $http.get("http://172.16.0.5:7777/test/exam/manager/delSubject.action",{
              params:{
                  "subject.id":id
              }
          }).success(function (data) {
              handler(data);
          })
        };
        //审核题目
        this.checkSubject = function (id,state,handler) {
            $http.get("http://172.16.0.5:7777/test/exam/manager/checkSubject.action",{
                params:{
                    "subject.id":id,
                    "subject.checkState":state
                }
            }).success(function (data) {
                handler(data);
            })
        };
        //保存添加题目信息
        this.saveSubject = function (params,handler) {
            //处理数据
            var obj = {};
            for(var key in params){
                var val = params[key];
                switch (key){
                    case "typeId":
                        obj['subject.subjectType.id'] = val;
                        break;
                    case "departmentId":
                        obj['subject.department.id'] = val;
                        break;
                    case "levelId":
                        obj['subject.subjectLevel.id'] = val;
                        break;
                    case "topicId":
                        obj['subject.topic.id'] = val;
                        break;
                    case "stem":
                        obj['subject.stem'] = val;
                        break;
                    case "answer":
                        obj['subject.answer'] = val;
                        break;
                    case "analysis":
                        obj['subject.analysis'] = val;
                        break;
                    case "choiceContent":
                        obj['choiceContent'] = val;
                        break;
                    case "choiceCorrect":
                        obj['choiceCorrect'] = val;
                        break;
                }
            }
            console.log(obj);
            //对obj对象进行表单格式的序列化操作，(默认使用json格式)，需在函数内部注入$httpParamSerializer
            obj = $httpParamSerializer(obj);
            $http.post("http://172.16.0.5:7777/test/exam/manager/saveSubject.action",obj,{
                //当使用post提交的时候必须设置请求头为表单提交时的Content-Type，对obj进行编码
                headers:{
                    "Content-Type":"application/x-www-form-urlencoded"
                }
            }).success(function (data) {
                    handler(data);
                });
        };

        //获取所有题目信息
        //function中要传一个params参数
        this.getAllSubject = function (params,handler) {
            //用一个空对象来接收属性和值，
            var data = {};
            //遍历data，将data转换为后台能识别的对象，
            for(var key in params){
                var val = params[key];
                if(val!=0){
                    switch(key){
                        case "a":
                            data['subject.subjectType.id'] = val;
                            break;
                        case "b":
                            data['subject.department.id'] = val;
                            break;
                        case "c":
                            data['subject.topic.id'] = val;
                            break;
                        case "d":
                            data['subject.subjectLevel.id'] = val;
                            break;
                    }
                }
            }
            //console.log(data);
            //$http.get("data/subjects.json").success(function (data) {
               $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjects.action",{
                  params:data
                }).success(function (data) {
                handler(data);
            });
        };
        
    }])
    //公共的服务，获取题目类型，方向，难度，知识点
    .factory("commonService",["$http",function ($http) {
        return {
            convertIndexToNo:function (index) {
                return index ==0 ?"A":(index ==1?"B":(index == 2?"C":(index ==3?"D":"E" )));
            },
            //获取题目类型数据
            getSubjecttypes:function (handler) {
                //$http.get("data/type.json").success(function (data) {
                $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectType.action").success(function (data) {
                    handler(data);
                });
            },
            //获取题目方向数据
            getSubjectdepartments:function (handler) {
                //$http.get("data/department.json").success(function (data) {
                $http.get("http://172.16.0.5:7777/test/exam/manager/getAllDepartmentes.action").success(function (data) {
                    handler(data);
                });
            },
            //获取题目知识点数据
            getSubjecttopics:function (handler) {
                //$http.get("data/topic.json").success(function (data) {
                $http.get("http://172.16.0.5:7777/test/exam/manager/getAllTopics.action").success(function (data) {
                    handler(data);
                });
            },
            //获取题目难度数据
            getSubjectlevel:function (handler) {
                //$http.get("data/level.json").success(function (data) {
                $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectLevel.action").success(function (data) {
                    handler(data);
                });
            }
        };
    }])
    //根据方向id获取知识点
    .filter("selectTopic",function () {
        //input为要过滤的内容、当前方向id，
        return function (input,id) {
            if(input){
                //数组中filter过滤方法(当回调函数返回true的时候把当前正在遍历的元素添加进即将返回的数组中)
                var result = input.filter(function (item) {
                    return item.department.id == id;
                });
                //将过滤后的结果返回
                return result;
            }
        }
    })
    .directive("selectOption",function () {
        return {
            restrict:"A",
            //简写方式，直接写link,要么就按格式写齐，要么就直接写link,操作dom的函数
            link:function (scope,element) {
                element.on("change",function () {
                    var type = $(this).attr("type");
                    var val = $(this).val();
                    var isChecked = $(this).prop("checked");
                    //console.log(val);
                    if(type == "radio"){
                        //重置选项
                        scope.subject.choiceCorrect = [false,false,false,false];
                        for( var i = 0;i<4;i++ ){
                            if(i==val){
                                scope.subject.choiceCorrect[i] = true;
                            }
                        }
                    } else if(type == "checkbox"){
                        for( var i = 0;i<4;i++ ){
                            if(isChecked){
                                if(i==val){
                                    scope.subject.choiceCorrect[i] = true;
                                }
                            }else{
                                if(i==val){
                                    scope.subject.choiceCorrect[i] = false;
                                }
                            }

                        }
                    }
                    //强制消化
                    scope.$digest();    //让修改的值映射到作用域绑定的scope.subject中
                })
            }
        }

    });
