const container=document.querySelector('.container');
const blocks=document.querySelectorAll('.block');

//根据数字的大小来选择格子的文字颜色和背景颜色
const colorMap=[
  {background:'#eee4da',textColor:'#776e65'},
  {background:'#ede0c8',textColor:'#776e65'},
  {background:'#f2b179',textColor:'#f9f6f2'},
  {background:'#f65e3b',textColor:'#f9f6f2'},
  {background:'#edcf72',textColor:'#f9f6f2'},
  {background:'#eee4da',textColor:'#776e65'},
  {background:'#ede0c8',textColor:'#776e65'},
  {background:'#f2b179',textColor:'#f9f6f2'},
  {background:'#f65e3b',textColor:'#f9f6f2'},
  {background:'#edcf72',textColor:'#f9f6f2'},
  {background:'#edcf72',textColor:'#f9f6f2'}
];
//游戏结束的标志
var gameoverflag=false;
//随机生成所用的数组
const randonNumbers=[2,4];

//顶部偏移量
const topOffset=blocks[0].offsetTop;
//左部偏移量
const leftOffset=blocks[0].offsetLeft;
//水平间距
const horizontalGap=blocks[1].offsetLeft-blocks[0].offsetLeft;
//垂直间距
const verticalGap=blocks[4].offsetTop-blocks[0].offsetTop;

//4×4的格子所对应的数组
var tileMap=new Array(4);

for(var i=0;i<tileMap.length;i++){
  tileMap[i]=new Array(4);
  for(var j=0;j<tileMap[0].length;j++)
    tileMap[i][j]=null;
}

//数字格子对象
function Tile(x,y,number){
  this.x=x;
  this.y=y;
  this.number=number;
  this.color=null;
  this.tile=null;
  this.updatePosition=function(x,y){
    this.x=x;
    this.y=y;
  }
  this.rankup=function(num){
    this.number*=2;
    this.paint();
  }
  this.pickColor=function(){
    let num=this.number;
    let count=0;
    while(num!=1){
      num/=2;
      count++;
    }
    this.color=colorMap[count-1];
  }
  this.placeTile=function() {
    let block=blocks[this.x+this.y*4];
    let inner=document.createElement('div');
    inner.classList.add('inner');
    this.tile=inner;
    container.append(inner);
    this.tile.style.left=block.offsetLeft+'px';
    this.tile.style.top=block.offsetTop+'px';
    tileMap[this.x][this.y]=this;
    this.paint();
  }
  this.paint=function() {
    this.pickColor();
    this.tile.style.transform='scale(1)';
    this.tile.style.backgroundColor=this.color.background;
    this.tile.style.color=this.color.textColor;
    this.tile.innerHTML=this.number;
  }
  this.move=function(x,y) {
    this.updatePosition(x,y);
    this.tile.style.left=(leftOffset+horizontalGap*x)+'px';
    this.tile.style.top=(topOffset+verticalGap*y)+'px';
  }
  this.remove=function(){
    tileMap[this.x][this.y]=null;
    this.tile.remove();
  }
}

//初始化
function init(){
  let random1={
    x:Math.floor(Math.random()*4),
    y:Math.floor(Math.random()*4)
  };
  let random2={
    x:Math.floor(Math.random()*4),
    y:Math.floor(Math.random()*4)
  };
  while(random1.x==random2.x&&random1.y==random2.y){
    random2={
      x:Math.floor(Math.random()*4),
      y:Math.floor(Math.random()*4)
    };
  }
  let tile1=new Tile(random1.x,random1.y,randonNumbers[Math.round(Math.random())]);
  let tile2=new Tile(random2.x,random2.y,randonNumbers[Math.round(Math.random())]);
  tile1.placeTile();
  tile2.placeTile();
}

init();

//在未被占用的格子随机生成一个数字
function generateRandom(){
  let available=[];
  for(var i=0;i<tileMap.length;i++){
    for(var j=0;j<tileMap[0].length;j++)
      if(tileMap[i][j]==null)
        available.push({x:i,y:j});
  }
  if(available.length==0)
    return;
  let random=Math.floor(Math.random()*available.length);
  var tile=new Tile(available[random].x,available[random].y,randonNumbers[Math.round(Math.random())]);
  tile.placeTile();
}

//消去格子
function merge(direction,line) {
  let merged=false;
  if(direction=='left'){
    for(var i=0;i<tileMap.length-1;i++){
      if(tileMap[i+1][line]&&tileMap[i][line]&&(tileMap[i][line].number==tileMap[i+1][line].number)){
        merged=true;
        tileMap[i][line].rankup();
        tileMap[i+1][line].remove();
        tileMap[i+1][line]=null;
        let offset=i+1;
        for(var j=i+1;j<tileMap.length;j++){
          if(tileMap[j][line]){
            tileMap[offset][line]=tileMap[j][line];
            tileMap[j][line]=null;
            tileMap[offset][line].move(offset++,line);
          }
        }
      }
    }
  }
  else if(direction=='right'){
    for(var i=tileMap.length-1;i>0;i--){
      if(tileMap[i][line]&&tileMap[i-1][line]&&(tileMap[i][line].number==tileMap[i-1][line].number)){
        merged=true;
        tileMap[i][line].rankup();
        tileMap[i-1][line].remove();
        tileMap[i-1][line]=null;
        let offset=i-1;
        for(var j=i-1;j>=0;j--){
          if(tileMap[j][line]){
            tileMap[offset][line]=tileMap[j][line];
            tileMap[j][line]=null;
            tileMap[offset][line].move(offset--,line);
          }
        }
      }
    }
  }
  else if(direction=='top'){
    for(var i=0;i<tileMap[0].length-1;i++){
      if(tileMap[line][i]&&tileMap[line][i+1]&&(tileMap[line][i].number==tileMap[line][i+1].number)){
        merged=true;
        tileMap[line][i].rankup();
        tileMap[line][i+1].remove();
        tileMap[line][i+1]=null;
        let offset=i+1;
        for(var j=i+1;j<tileMap[0].length;j++){
          if(tileMap[line][j]){
            tileMap[line][offset]=tileMap[line][j];
            tileMap[line][j]=null;
            tileMap[line][offset].move(line,offset++);
          }
        }
      }
    }
  }
  else if(direction=='bottom'){
    for(var i=tileMap[0].length-1;i>0;i--){
      if(tileMap[line][i]&&tileMap[line][i-1]&&(tileMap[line][i].number==tileMap[line][i-1].number)){
        merged=true;
        tileMap[line][i].rankup();
        tileMap[line][i-1].remove();
        tileMap[line][i-1]=null
        let offset=i-1;
        for(var j=i-1;j>=0;j--){
          if(tileMap[line][j]){
            tileMap[line][offset]=tileMap[line][j];
            tileMap[line][j]=null;
            tileMap[line][offset].move(line,offset--);
          }
        }
      }
    }
  }
  return merged;
}

//判断游戏是否结束
function isGameover(flag){
  //格子是否已满
  let isFull=true;

  for(let column of tileMap){
    for(let tile of column){
      if(tile==null){
        isFull=false;
      }
    }
  }
  if(flag&&isFull)
    gameoverflag=true;
}

//重新排列
function rePositioning(direction) {
  //格子是否消去
  let flag=true;
  //格子是否移动
  let moved=false;
  if(direction=='left'){
    for(var i=0;i<tileMap[0].length;i++){
      let min=0;
      for(var j=0;j<tileMap.length;j++){
        if(tileMap[j][i]){
          let originY=tileMap[j][i].y;
          if(min!=tileMap[j][i].x){
            moved=true;
            tileMap[min][originY]=tileMap[j][i];
            tileMap[tileMap[j][i].x][originY]=null;
            tileMap[min][originY].move(min++,originY);
          }
          else{
            min++;
          }
        }
      }
      if(merge(direction,i))
        flag=false;
    }
  }
  else if (direction=='right'){
    for(var i=0;i<tileMap[0].length;i++){
      let max=tileMap[0].length-1;
      for(var j=tileMap[0].length-1;j>=0;j--){
          if(tileMap[j][i]){
            let originY=tileMap[j][i].y;
            if(max!=tileMap[j][i].x){
              moved=true;
              tileMap[max][originY]=tileMap[j][i];
              tileMap[tileMap[j][i].x][originY]=null;
              tileMap[max][originY].move(max--,originY);
            }
            else{
              max--;
            }
          }
      }
      if(merge(direction,i))
        flag=false;
    }
  }
  else if (direction=='top') {
    for(var i=0;i<tileMap.length;i++){
      let min=0;
      for(var j=0;j<tileMap[i].length;j++){
        if(tileMap[i][j]){
          let originX=tileMap[i][j].x;
          if(min!=tileMap[i][j].y){
            moved=true;
            tileMap[originX][min]=tileMap[i][j];
            tileMap[originX][tileMap[i][j].y]=null;
            tileMap[originX][min].move(originX,min++);
          }
          else{
            min++;
          }
        }
      }
      if(merge(direction,i))
        flag=false;
    }
  }
  else if (direction=='bottom') {
    for(var i=0;i<tileMap.length;i++){
      let max=tileMap[0].length-1;
      for(var j=tileMap[i].length-1;j>=0;j--){
        if(tileMap[i][j]){
          let originX=tileMap[i][j].x;
          if(max!=tileMap[i][j].y){
            moved=true;
            tileMap[originX][max]=tileMap[i][j];
            tileMap[originX][tileMap[i][j].y]=null;
            tileMap[originX][max].move(originX,max--);
          }
          else{
            max--;
          }
        }
      }
      if(merge(direction,i))
        flag=false;
    }
  }
  isGameover(flag);
  return moved;
}

//添加
window.onkeydown=function(e) {
  if(gameoverflag){
    return;
  }
  //上
  if(e.keyCode==38||e.keyCode==87){
    if(rePositioning('top'))
      generateRandom();
  }
  //左
  else if (e.keyCode==37||e.keyCode==65) {
    if(rePositioning('left'))
      generateRandom();
  }
  //右
  else if (e.keyCode==39||e.keyCode==68) {
    if(rePositioning('right'))
      generateRandom();
  }
  //下
  else if (e.keyCode==40||e.keyCode==83) {
    if(rePositioning('bottom'))
      generateRandom();
  }
  if(gameoverflag){
    document.querySelector('.gameover').style.opacity=1;
  }
}
