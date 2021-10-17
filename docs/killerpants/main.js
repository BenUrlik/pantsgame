title = "Killer Pants";

description = `
left click to start
`;

characters = [
  `
  pppp
  p  p
  p  p
  pppp
  `,
  `
  bbbb
  bbbb
  b  b
  b  b
  b  b
  b  b
  `,
  `
  rrr
  rrrr
  rrrr
   rrr
     r
  `,
  `
   rrr
  rrrr
  rrrr
  rrr
  r   
  `,
  `
  lll
  llll
  llll
   lll
     l
  `,
  `
   lll
  llll
  llll
  lll
  l   
  `
];

const window_size = {
  WIDTH: 200,
  HEIGHT: 200  
};

options = {
  theme: 'pixel',
  viewSize: {x:window_size.WIDTH, y:window_size.HEIGHT},
  isPlayingBgm: true,
  // isSpeedingUpSound: true,
  isShowingScore: true,
  isReplayEnabled: true,
  // seed: 300
};

let player;
let test_pants;
let pos;
let moveAngle;
let moveDist;
let angle;
let arcFrom;
let arcTo;
let shots;
let isPressing;
let heart_x = 30;
let pants_move_speed = 0.5;
let player_offset = 5;
let timer = 0;
let immunity_timer = 30;
let pants = [];
let rnd_loc = vec();

const spawnpoints = [ vec(window_size.WIDTH/2, window_size.HEIGHT), 
                      vec(window_size.WIDTH/2, 0),
                      vec(0, window_size.HEIGHT/2),
                      vec(window_size.WIDTH, window_size.HEIGHT/2), ];

function update() {
  if (!ticks) {
    pos = vec(50, 50);
    angle = 0;
    shots = [];
    isPressing = false;
    moveAngle = 0;
    moveDist = 0;
    player = { pos: vec(window_size.WIDTH/2, window_size.HEIGHT/2),
               hitpoints: 3
              };

    test_pants = vec(window_size.WIDTH/2, window_size.HEIGHT/3);
    pants.push(test_pants);
  }

  // Player char
  color("red");
  const player_char = char("a", player.pos);

  // Player attack
  if (moveDist > 1) {
    player.pos.add(vec(moveDist * 0.2).rotate(moveAngle));
    moveDist *= 0.2;
    if (!player.pos.isInRect(10, 10, 90, 90)) {
      moveAngle += PI;
    }
    player.pos.clamp(10, 90, 10, 90);
  }
  angle += 0.07 * difficulty;
  // color("light_blue");
  // arc(50, 50, 7, 4);
  color("light_black");
  line(player.pos, vec(9).rotate(angle).add(player.pos), 2);
  color("black");
  char("a", player.pos);
  let range = 0;
  // Draws the two lines when holding the left mouse button
  if (isPressing) {
    arcTo = angle;
    range = 300 / sqrt((arcTo - arcFrom) * 30);
    // color("green");
    line(player.pos, vec(range).rotate(arcFrom).add(player.pos));
    line(player.pos, vec(range).rotate(arcTo).add(player.pos));
    arc(player.pos, range, 3, arcFrom, arcTo);
  }
  // If the attack gets too big it cancels it
  if (isPressing && arcTo - arcFrom > PI) {
    isPressing = false;
  }
  // Confirms player shot/wave
  if (isPressing && input.isJustReleased) {
    isPressing = false;
    if (shots.length === 0) {
      play("select");
      shots.push({ pos, d: 0, range, arcFrom, arcTo });
    }
    moveAngle = (arcTo + arcFrom) / 2;
    moveDist = range / 2;
  }
  // boolean switch for player pressing button
  if (input.isJustPressed) {
    play("laser");
    arcFrom = angle;
    isPressing = true;
  }
  // "Shoots" the waves
  color("cyan");
  shots = shots.filter((s) => {
    s.d += 2;
    arc(player.pos, s.d, 5, s.arcFrom, s.arcTo);
    return s.d < s.range;
  });

  // Heart 1
  
  const heart_color1 = ["light_red", "light_black"][player.hitpoints >= 1 ? 0 : 1];
  const heart_color2 = ["light_red", "light_black"][player.hitpoints >= 2 ? 0 : 1];
  const heart_color3 = ["light_red", "light_black"][player.hitpoints >= 3 ? 0 : 1];
  color(heart_color1);
  if(player.hitpoints >= 1) {
    char("c", vec(2, 10));
    char("d", vec(2+4, 10));
  } else {
    // color("white");
    char("e", vec(2, 10));
    char("f", vec(2+4, 10));
  }

  // Heart 2
  color(heart_color2);
  if(player.hitpoints >= 2) {
    char("c", vec(12, 10));
    char("d", vec(12+4, 10));
  } else {
    char("e", vec(12, 10));
    char("f", vec(12+4, 10));
  }
  color(heart_color3);
  // Heart 3
  if(player.hitpoints >= 3) {
    char("c", vec(22, 10));
    char("d", vec(22+4, 10));
  }
  else {
    char("e", vec(22, 10));
    char("f", vec(22+4, 10));
  }
  
  // Player movement and limitations
  player.pos = vec(input.pos.x, input.pos.y);
  player.pos.clamp(0+player_offset, window_size.WIDTH-player_offset, 0+player_offset, window_size.HEIGHT-player_offset);

  if(timer >= 100) {
    locate_spawn_edge();
    rnd_loc.clamp(0+player_offset, window_size.WIDTH-player_offset, 0+player_offset, window_size.HEIGHT-player_offset);
    pants.push(rnd_loc);
    timer = 0;
  }

  // Spawns pants in array
  pants.forEach((o) => {
    color("blue");
    const your_mom = char("b", o).isColliding.rect.cyan;
    if(your_mom ) { 
      remove(pants, (p , i = 1) => { if(p == o) return true;});
      addScore(100);
    }
    let choice = floor(rnd(0,2));
    if(choice == 0) chase_player(o);
    else if (choice == 1)do_random_shit(o);
  });
  
  // Checks to see if player gets hit by pants
  color("red");
  if(char("a", player.pos).isColliding.char.b && immunity_timer == 0) { player.hitpoints--; immunity_timer = 30;}

  // Lose conditions for Game over screen
  color("red");
  if(char("a", player.pos).isColliding.char.b && player.hitpoints <= 0) { 
    timer = 0;
    remove(pants, (obst) => { return true; });
    end(); 
  }
  if(immunity_timer != 0) immunity_timer--;
  timer++;
}

// Makes the pants chase the player
function chase_player(pant_vec) {
  if (pant_vec.x > player.pos.x) { pant_vec.x -= pants_move_speed; }
  if (pant_vec.x < player.pos.x) { pant_vec.x += pants_move_speed; }
  
  if (pant_vec.y > player.pos.y) { pant_vec.y -= pants_move_speed; }
  if (pant_vec.y < player.pos.y) { pant_vec.y += pants_move_speed; }
}

// Makes the pants shake like crazy
function do_random_shit(pant_vec) {
  pant_vec.x += rnd(0, 2);
  pant_vec.x -= rnd(0,2);
  pant_vec.y += rnd(0, 2);
  pant_vec.y -= rnd(0,2);
}

// Creates a vec to have the pants spawn on one of the edges
function locate_spawn_edge() {
  let edge_loc = floor(rnd(1,5));
  if(edge_loc == 1) { rnd_loc = vec(rnd(0,10), rnd(0, window_size.HEIGHT)); }
  else if(edge_loc == 2) { rnd_loc = vec(rnd(0, window_size.WIDTH), rnd(0,10)); }
  else if(edge_loc == 3) { rnd_loc = vec(rnd(window_size.WIDTH-10, window_size.WIDTH), rnd(0,window_size.HEIGHT)); }
  else if(edge_loc == 4) { rnd_loc = vec(rnd(0, window_size.WIDTH), rnd(window_size.HEIGHT-10, window_size.HEIGHT)); }
}