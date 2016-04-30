var app = angular.module('firebaseApp', []);
app.controller('ctrl', ['$scope', function($scope){
  $scope.BASE_URL = "https://dev-preppo.firebaseio.com";
  
  $scope.log = function(x){
    //console.log(x);
  }
  
  $scope.myMouseEnter = function(event){
    var obj = event.currentTarget; //event.target gives the child element
    console.log("mouseenter " + jQuery("span:first", obj).html() + " " + obj.tagName);
    jQuery(obj).parents().removeClass('border');
    jQuery(obj).siblings().removeClass('border');
    jQuery(obj).addClass("border");
  }
      
  $scope.myMouseOut = function(event){
    var obj = event.currentTarget;
    console.log("mouseout " + jQuery("span:first", obj).html() + " " + obj.tagName);
    jQuery(obj).removeClass("border");
  }
  
  $scope.checkTerminal = function(data){
    //consider null value as terminal
    return (data == null || typeof(data) === 'string' || typeof(data) === 'number' || typeof(data) === 'boolean');
  }
  
  $scope.moreIndicator = "<more>"

  $scope.convert = function(data){
    var isTerminal= $scope.checkTerminal(data);
    if(isTerminal) return data;

    var arr = [];
    var key;
    var val;
    for(k in data){
      arr.push({key : k, val : $scope.convert(data[k])});
    }
    return arr;
  }

  $scope.loadData = function(node){
    var shallowUrl = $scope.BASE_URL + node.url + ".json" + "?shallow=true";
    node.isLoading = true;
    $.ajax(shallowUrl, {
      success: function(data) {
        node.isLoading = false;
        console.log("success for url=" + shallowUrl);
        if($scope.checkTerminal(data)){ //NOT a dict or array
          console.log("replaced with a terminal value " + data);
          if(data == null){
            data = "<null>";
          }
          else if(typeof(data) === 'string'){
            data = '"' + data + '"';
          }
          //nothing to do in case of number and boolean
          node.val = data;
          node.isLeaf = true;
        }
        else{
          var dataArray = [];
          var count = 0;
          for(var key in data){
            //console.log("pushing " + k);
            dataArray.push({key : key, val : $scope.moreIndicator, url : node.url + key + "/", isLeaf : false});
            count++;
          }
          console.log("pushed " + count + " children");
          node.val = dataArray;
        }
        
        node.show = true;
        $scope.$apply();
      },
      error: function() {
        node.isLoading = false;
        console.log("error occured");
        $('#notification').html('An error occurred');
        $scope.$apply();
      }
    });
  };

  $scope.rootData = [{key : "Root", val : $scope.moreIndicator, url : "/", isLeaf : false}];
  sample = $scope.rootData;
}]);
