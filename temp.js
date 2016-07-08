$scope = {};
$scope.checkTerminal = function(data){
    //consider null value as terminal
    return (data == null || typeof(data) === 'string' || typeof(data) === 'number' || typeof(data) === 'boolean');
  };
  
  $scope.moreIndicator = "<more>";

  //update the node itself, returns nothing
  $scope.prettifyTerminalNode = function(node){
    var data = node.val;
    if(data == null){
      node.val = "<null>";
      node.wasDeleted = true; //override since value is null
    }
    else if(typeof(data) === 'string'){
      node.val = '"' + data + '"';
    }
    else{
      node.val = data;
    }
  };
  
  //updates the node itself, returns nothing
  $scope.convertDeepNode = function(node){
    console.log("node.key=" + node.key);
    var isTerminal= $scope.checkTerminal(node.val);
    if(isTerminal){
      node.isLeaf = true;
      $scope.prettifyTerminalNode(node);
      return;
    }

    //convert recusively
    var dataArray = [];
    for(key in node.val){
      var newNode = {key : key, val : node.val[key], url : node.url + key + "/"};
      $scope.convertDeepNode(newNode);
      dataArray.push(newNode);//isLeaf not set
    }
    
    //set the fields of this node
    node.val = dataArray;
    node.isLeaf = false;
  };

module.exports = {
  s : $scope
}