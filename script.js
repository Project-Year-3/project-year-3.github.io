init = function(){
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  min_num = 10;
  c_width = canvas.width/min_num;
  num_across = 10;
  num_down = Math.ceil(canvas.height / c_width)
  if(canvas.height < canvas.width){
    c_width = canvas.height/min_num;
    num_down = 10;
    num_across = Math.ceil(canvas.width/ c_width);
  }

  total_num = num_down * num_across;

  hard_state = [];
  soft_state = [];
  delta = 0.04;
  hasTouched = false;

  for(let i=0; i<total_num; i++){
    hard_state.push(Math.round(Math.random()));
    soft_state.push(0);
  }
  timer = null;

  ctx.fillStyle="hsl(0,0%,95%)";
  ctx.strokeStyle="hsl(0,0%,75%)";

  render = function(){
    ctx.beginPath();
    ctx.clearRect(0,0,canvas.width,canvas.height)
    anim = requestAnimationFrame(render);
    let i = soft_state.length;
    let is_equal = true;

    if(hasTouched){
      hard_state[c_index] = 1 - hard_state[c_index];
      hasTouched = false;
    }

    while(i--){
      if(hard_state[i] != soft_state[i]){
        is_equal = false;
      }
      if(!is_equal){
        let s = Math.sign(hard_state[i] - soft_state[i])
        soft_state[i] += s*delta;
        soft_state[i] = Math.round(100*soft_state[i])/100;
      }
      let w = c_width*soft_state[i];
      let x=(i%num_across)*c_width + (c_width-w)/2;
      let y = Math.floor(i/num_across)*c_width + (c_width-w)/2;
      
      ctx.moveTo(x,y);
      // ctx.fillRect(x,y,w,w);
      ctx.strokeRect(x,y,w,w)
    }

    if(!is_equal){
      return true;
    }

    if(timer == null){
      timer = Date.now();
      return true;
    }
    if(Date.now() - timer > 50){
      timer = null;
    } else {
      return true;
    }

    i=soft_state.length;
    while(i--){
      ns = [
        i-num_across-1,i-num_across,i-num_across+1,
        i-1, i+1,
        i+num_across-1,i+num_across,i+num_across+1,
      ];
      for(let j in ns){
        if(ns[j] < 0){
          ns[j] = total_num + ns[j];
        } else if(ns[j] > total_num){
          ns[j] = ns[i] - total_num;
        }
        ns[j] = soft_state[ns[j]]
      }
      let sum = ns.reduce((a,b)=>a+b,0);
      if(sum < 2){
        hard_state[i] = 0;
      } else if(sum == 3) {
        hard_state[i] = 1;
      } else if(sum > 3){
        hard_state[i] = 0;
      }
    }
  }
  render();

  document.body.addEventListener("touchend",(e)=>{
    let x = e.changedTouches[0].clientX;
    let y = e.changedTouches[0].clientY;
    // let x = e.screenX;
    // let y = e.screenY;
    let maxW = window.innerWidth;// document.body.clientWidth;
    let maxH = window.innerHeight;//document.body.clientHeight;
    let cy = (y/maxH)*num_down;
    let cx = (x/maxW)*num_across;
    c_index = Math.floor(cy)*num_across + Math.floor(cx);
    hasTouched = true;
  });
}
init();