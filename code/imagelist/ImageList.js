// JavaScript Document

function ImageList(tag,size){
  var url = "/code/imagelist/imagelist.php?size=" + size + "&tag=" + tag;
  var xhr = new XMLHttpRequest();
  var _this = this; 
  xhr.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200) {
      var query = JSON.parse(xhr.responseText);
      _this.images = query.query.allimages;
    }
  }
  xhr.open("GET", url, false);
  xhr.send();
}

ImageList.prototype.length = function(){
  return (this.images ? this.images.length : 0);
}

ImageList.prototype.getImage = function(index){
  return ((this.images && this.images.length > index) ? this.images[index] : 0);
}