var app = angular.module('firebaseApp', []);

app.controller('ctrl', ['$scope', '$location', function($scope, $location){
  /* start config */
  var defaultFirebaseDB = 'shining-inferno-4918';
  
  //auth enabled firebase databases
  $scope.authEnabledDatabaseMap = {
    'shining-inferno-4918' : 'U2FsdGVkX1+9IzYDVmNaiU4u89S3AopuqldPExCY/SyTwQcjdwtwQ3cOmqIlL14pXo8ItMpVt0Wq/+O/IsK/KRuOGpYNHfckLBBuAgwx3E2C5CEJbO0UY28CIWvh1AyeaCJgrsYclpv1x94dgESkaZp9ZViwLoXZa6h95uqINmDNgBInl+/krJ6YDtExls6ZY/+Y2aLOTGVEo9fmLt07ZZhVfMupzE1Edk+fc7N43YM2RtW9XKz1JKZc6IbPfMRUMIhbCbM+mBkQhaSM1UGs9/A3/W0RkicxvOETUCcDvGM='
  };
  
  $scope.authEnabledDatabaseList = [];
  for(var k in $scope.authEnabledDatabaseMap){
    $scope.authEnabledDatabaseList.push(k);
  }
  /* end config */
  
  var firebaseDB = defaultFirebaseDB;
  
  console.log("location.search() %j", $location.search());
  
  var target = $location.search().target;
  var key = $location.search().key;
  
  if(target){
    firebaseDB = target;
  }
  
  $scope.showInstructions = true;
  $scope.BASE_URL = "https://" + firebaseDB + ".firebaseio.com";
  $scope.authPart = ''; //auth query part in firebase REST calls : e.g /animals/cat.json?auth=<TOKEN>
  $scope.errorMessage = "";
  
  if(key && $scope.authEnabledDatabaseMap[firebaseDB]){
    //cipher key provided, and token present in map
    var cipheredToken = $scope.authEnabledDatabaseMap[firebaseDB];
    
    // Decrypt
    try{
      var bytes  = CryptoJS.AES.decrypt(cipheredToken, key);
      var token = bytes.toString(CryptoJS.enc.Utf8);
      console.log("auth token set to " + token);
      $scope.authPart = 'auth=' + token;
    }
    catch(e){
      $scope.errorMessage = "Invalid key to decipher the auth token";      
    }
  }
  else{
    console.log("no auth token set");
  }
  
  console.log("BASE_URL |" + $scope.BASE_URL + "|");
  console.log("authPart |" + $scope.authPart + "|");
  
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
    var shallowUrl = $scope.BASE_URL + node.url + ".json" + "?shallow=true" + $scope.authPart;
    node.isLoading = true;
    $scope.errorMessage = "";
    $.ajax(shallowUrl, {
      success: function(data, textStatus, xhr) {
        node.isLoading = false;
        node.wasDeleted = false;
        node.isLeaf = false;
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
      error: function(xhr, textStatus, err) {
        node.isLoading = false;
        console.log("GET error for url=" + shallowUrl + " status=" + xhr.status + ":"+ xhr.statusText);
        $scope.errorMessage = "GET error status " + xhr.status + ":"+ xhr.statusText;
        $scope.$apply();
      }
    });
  };
  
  $scope.deleteData = function(node){
    if(node.delete !== 'yes'){
      node.delete = '';
      return;
    }
    var resourceUrl = $scope.BASE_URL + node.url + ".json" + "?" + $scope.authPart;
    node.isLoading = true;
    $scope.errorMessage = "";
    $.ajax({
      url : resourceUrl,
      type : "DELETE",
      success: function(data, textStatus, xhr) {
        node.isLoading = false;
        console.log("DELETE success for url=" + resourceUrl);
        node.val = "<null>";
        node.isLeaf = true;
        node.wasDeleted = true;
        $scope.$apply();
      },
      error: function(xhr, textStatus, err) {
        node.isLoading = false;
        console.log("DELETE error for url=" + resourceUrl + " status=" + xhr.status + ":"+ xhr.statusText);
        $scope.errorMessage = "DELETE error status " + xhr.status + ":"+ xhr.statusText;
        $scope.$apply();
      }
    });
  };

  $scope.rootData = [{key : "Root", val : $scope.moreIndicator, url : "/", isLeaf : false}];
  sample = $scope.rootData;
}]);
