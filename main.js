//<캔버스 세팅>

let canvas;
let ctx;
//이미지를 그리는걸 도와줄 변수임
canvas = document.createElement("canvas")
//캔버스라는걸 만들어서 요 변수에 넣어둔다 
//변수는 뭐다? 어떤 값을 담아두는 양동이 이다. 
ctx = canvas.getContext("2d")
//방금 만든 캔버스에다가 어떤컨텍스트를 가지고 올것인데 그건 투디이다.
//우리가 캔버스에서  투디의 세계를  ctx에 가지고 올것이다. 
canvas.width=400;
canvas.height=700;
//이캠버스를 html에 넣어준다
document.body.appendChild(canvas);
//바디테크에 붙여준다 누구를? 캔버스를 

//이미지를 불러오는 함수를 냅다 만들기
let backgroundImage,spaceshipImage,bulletImage,enemyImage,gameoverImage;
let gameover=false//true　이면 게임이 끝남/ false이면 게임 안끝남
let score=0
//우주선좌표 -> 따로 빼놓는 이유/ 계속 우주선이 움직이며 바뀔거니까 
let spaceshipX = canvas.width/2-32
let spaceshipY = canvas.height-64
let bulletList=[]//총알들을 저장하는 리스트


function Bullet(){
  this.x=0;
  this.y=0;
  this.init=function(){
    this.x = spaceshipX +5;
    this.y = spaceshipY
    this.alive=true//true 살아있는 총알, false 죽어있는총알

    bulletList.push(this)
  };
  this.update =function(){
    this.y-=5;
  };

  this.checkHit=function(){
    //총알.y값이 <=적군의 y값보다 작아진다. and
    // 총알x >= 적군.x and 총알의x <= 적군x +40(적군의넓이)
    for(let i=0; i<enemyList.length; i++){
      if(
        this.y <= enemyList[i].y && 
        this.x >= enemyList[i].x && 
        this.x <= enemyList[i].x +48
        ) {
        //총알이 죽게됨 적군의 우주선이 없어짐 점수획득
        score++;
        this.alive=false;//죽은총알
        enemyList.splice(i,1)
      }
    }
  };
}

function generateRandomValue(min,max){
  let randomNum = Math.floor(Math.random()*(max-min+1))+min//인터넷에서 구글링 찾아보기//(0~1)까지 숫자를 반영,반환을 함
  //Math.floor= 내림함수
  return randomNum
}

let enemyList=[]
function Enemy(){
  this.x=0;
  this.y=0;
  this.init =function(){
    this.y= 0
    this.x= generateRandomValue(0,canvas.width-48)
    enemyList.push(this)
  };
  this.update=function(){
    this.y +=2;//적군떨어지는 스피드

    if(this.y >= canvas.height-50){
      gameover =true; 
      console.log("gameover");
    }
  }
}
function loadImage(){
  backgroundImage = new Image();
  backgroundImage.src="images/background.jpeg";

  spaceshipImage = new Image();
  spaceshipImage.src="images/spaceship.png";

  bulletImage = new Image();
  bulletImage.src="images/bullet.png";

  enemyImage = new Image();
  enemyImage.src="images/enemy.png";

  gameoverImage = new Image();
  gameoverImage.src="images/gameover.png";
}
//이렇게 이미지를 가지고 왔으니 이미지들을 캔버스에 그려주면 된다. 
//이미지를 보여주는 걸 이제 하면됨 

let keysDown={}
function setupKeyboardListener(){
  document.addEventListener("keydown",function(event){

    keysDown[event.keyCode]=true
  document.addEventListener("keyup",function(event){
    delete keysDown[event.keyCode]

    if(event.keyCode == 32){
      creatBullet()//총알생성함수
      let b = new Bullet()//new 는 우리가 펑션블랫을 new생성 찍어서 하나 더 만들어줌
      //하나 더 만들어준걸 어디다 저장을 하느냐 b에 저장을 해준다. 
      b.init();
      console.log("새로운총알리스트",bulletList);
    }
  })
  })
}
function creatBullet(){
  console.log("총알생성");
}

function createEnemy(){
  const interval = setInterval(function(){
    let e =new Enemy()
    e.init()
  },1000)
    //(호출하고싶은함수,시간)(적군생성,1)
}
function update(){
  if( 39 in keysDown)//right
    spaceshipX +=5; //우주선의 속도
  if( 37 in keysDown) //left
    spaceshipX -=5;
  if(spaceshipX <=0){
    spaceshipX=0
  }
  if(spaceshipX >= canvas.width-64){
    spaceshipX=canvas.width-64;
  }//우주선의 좌표값이 무한대로 업데이트가 되는게 아닌 경기장안에 있도록!
  //총알의 y좌표 업데이트하는 함수 호출!
  for(let i=0; i<bulletList.length; i++){
    if(bulletList[i].alive){
      bulletList[i].update();
    bulletList[i].checkHit();
    }
  }
  for(let i=0; i <enemyList.length; i++){
    enemyList[i].update();
  }
}

//이벤트 읽어오는 함수?->document.addEventListener
//addEventListener 함수는 항상 event에 대한 정보를 넘겨줌


function render(){
  ctx.drawImage(backgroundImage,0,0, canvas.width,canvas.height)
  ctx.drawImage(spaceshipImage,spaceshipX, spaceshipY);
  ctx.fillText(`score:${score}`,20,20);
  ctx.fillStyle="white";
  ctx.font ="20px Arial";

  for(let i=0;i<bulletList.length;i++){
    if(bulletList[i].alive){
      ctx.drawImage(bulletImage,bulletList[i].x,bulletList[i].y)
    }
  }
  for(let i=0; i < enemyList.length; i++){
    ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
  }
}
//이렇게만하면 안보이지롱 왜냐? 함수를 만들기만 히고 불러오지 않았으니까 이제 불러와보쟈

function main(){
  if(!gameover){
    update(); //왜 여기서 불러주냐? 좌표값을 업데이트하고
  render(); //그려주고 
  requestAnimationFrame(main);//이렇게 미친듯이 반복사는게 애니메이션 효과!
  }else{
    ctx.drawImage(gameoverImage,10,100,380,380)
  }
}

loadImage();
setupKeyboardListener();
createEnemy();
main();
//방향키를 누르면
//우주선의 xy좌표가 바뀌고
//다시render 그려준다

//---------총알만들어주기
//1.스페이스를 누르면 총알발사
//2.총알발사 = y좌표가 줄어든다 총알x 값은? 스페이스를 누른 순간의 우주선의 x좌표
//3. 발사된 총알들은 어디다 저장한다? 총알배열에 저장한다. array를 만들어준다 [총알, 총알 총알.]=b
//->이 각각의 총알은 xy좌표를 가지고 있어야 한다. 
//4.총알배열을 가지고 render 그려준다. 
//총알을 쉽게 만들어 주는 틀을 만들껀데 그걸 class라고 한다. 
//class bullet 틀안에 xy좌표를 정의하고 총알을 만들때마다 이 bullet을 가져다 만들어 줄꺼다 
//이 bullet1,2 이런식으로 
//그래서 이 틀안에 모든 총알이 xy좌표가 다 들어있고, 총알에 필요한 모든함수도 저장할수 있다.
//------------------------ 

//--------적군의 특징
// 1.적군은 위치가 랜덤하다/ xy자표 , 초기회하는init , 적군의 값을 update하는 함수
//2. 적군은 밑으로 내려온다 ->y좌표가 증가한다
//3.1초마다 하나씩 적군이 나온다 
//4. 적군의 우주선이 바닥에 닿으면 게임오바
// 적군과 총알이 만나면 우주선이 사라진다 점수 1점 획득 
//----------------

//--------적군이 죽는다
//총알이 적군에게 닿는다 
// 닿는다의 의미;  총알.y값이 <=적군의 y값보다 작아진다. and
//   총알x >= 적군.x and 총알의x <= 적군x +40(적군의넓이)
//닿으면 총알이 죽게된, 적군의 우주선이 없어짐 점수 획득