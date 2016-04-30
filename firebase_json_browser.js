var app = angular.module('firebaseApp', []);

app.controller('ctrl', ['$scope', '$location', function($scope, $location){
  $scope.BASE_URL = "https://dev-preppo.firebaseio.com";
  
  console.log("%j", $location.search().target);
  var target = $location.search().target;
  if(target){
    $scope.BASE_URL = "https://" + target + ".firebaseio.com";
  }
  
  $scope.genId = function(node){
    return 'id' + node.url.replace(/\//g, '_') + 'id';
  };
  
  $scope.hasClass = function(id, className, node){
    //console.log("hasClass() called with " + id + "|" + className);
    var bordered = jQuery("#" + id).hasClass("border");
    //console.log("hasClass() bordered=" + bordered);
    return bordered;
  };
  
  $scope.log = function(x){
    //console.log(x);
  };
  
  $scope.myMouseEnter = function(event){
    var obj = event.currentTarget; //event.target gives the child element
    //console.log("mouseenter " + jQuery("span:first", obj).html() + " " + obj.tagName);
    jQuery(obj).parents().removeClass('border');
    jQuery(obj).siblings().removeClass('border');
    jQuery(obj).addClass("border");
  };
      
  $scope.myMouseOut = function(event){
    var obj = event.currentTarget;
    //console.log("mouseout " + jQuery("span:first", obj).html() + " " + obj.tagName);
    jQuery(obj).removeClass("border");
  };
  
  $scope.checkTerminal = function(data){
    //consider null value as terminal
    return (data == null || typeof(data) === 'string' || typeof(data) === 'number' || typeof(data) === 'boolean');
  };
  
  $scope.moreIndicator = "<more>";

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
  };

  $scope.loadData = function(node){
    var shallowUrl = $scope.BASE_URL + node.url + ".json" + "?shallow=true";
    node.isLoading = true;
    $.ajax(shallowUrl, {
      success: function(data) {
        node.isLoading = false;
        node.wasDeleted = false;
        console.log("GET success for url=" + shallowUrl);
        if($scope.checkTerminal(data)){ //NOT a dict or array
          console.log("replaced with a terminal value " + data);
          if(data == null){
            data = "<null>";
            node.wasDeleted = true; //override since value is null
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
        console.log("GET error for url=" + shallowUrl);
        $scope.$apply();
      }
    });
  };
  
  $scope.deleteData = function(node){
    if(node.delete !== 'yes'){
      node.delete = '';
      return;
    }
    var resourceUrl = $scope.BASE_URL + node.url + ".json";
    node.isLoading = true;
    $.ajax({
      url : resourceUrl,
      type : "DELETE",
      success: function(data) {
        node.isLoading = false;
        console.log("DELETE success for url=" + resourceUrl);
        node.val = "<null>";
        node.isLeaf = true;
        node.wasDeleted = true;
        $scope.$apply();
      },
      error: function() {
        node.isLoading = false;
        console.log("DELETE error for url=" + resourceUrl);
        $scope.$apply();
      }
    });
  };

  $scope.rootData = [{key : "Root", val : $scope.moreIndicator, url : "/", isLeaf : false}];
  sample = $scope.rootData;
}]);
