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
  // isPlayingBgm: true,
  // isSpeedingUpSound: true,
  isShowingScore: true,
  isReplayEnabled: true,
  // seed: 300
};

let player;
let test_pants;
let pants_move_speed = 0.5;
let player_offset = 5;
let timer = 0;
let pants = [];
let rnd_loc = vec();

const spawnpoints = [ vec(window_size.WIDTH/2, window_size.HEIGHT), 
                      vec(window_size.WIDTH/2, 0),
                      vec(0, window_size.HEIGHT/2),
                      vec(window_size.WIDTH, window_size.HEIGHT/2), ];

function update() {
  if (!ticks) {
    player = { pos: vec(window_size.WIDTH/2, window_size.HEIGHT/2),
               hitpoints: 3
              };

    test_pants = vec(window_size.WIDTH/2, window_size.HEIGHT/3);
    pants.push(test_pants);
  }

  // Player char
  char("a", player.pos);

  // Heart 1
  if(player.hitpoints >= 1) {
    char("c", vec(10, 3));
    char("d", vec(10+4, 3));
  } else {
    char("e", vec(10, 3));
    char("f", vec(10+4, 3));
  }

  // Heart 2
  if(player.hitpoints >= 2) {
    char("c", vec(20, 3));
    char("d", vec(20+4, 3));
  } else {
    char("e", vec(20, 3));
    char("f", vec(20+4, 3));
  }
  
  // Heart 3
  if(player.hitpoints >= 3) {
    char("c", vec(30, 3));
    char("d", vec(30+4, 3));
  }
  else {
    char("e", vec(30, 3));
    char("f", vec(30+4, 3));
  }
  
  // Player movement and limitations
  player.pos = vec(input.pos.x, input.pos.y);
  player.pos.clamp(0+player_offset, window_size.WIDTH-player_offset, 0+player_offset, window_size.HEIGHT-player_offset);

  if(timer >= 100) {
    // let rnd_loc = vec(rnd(0,10), rnd(0,window_size.HEIGHT));
    locate_spawn_edge();
    console.log(rnd_loc);
    rnd_loc.clamp(0+player_offset, window_size.WIDTH-player_offset, 0+player_offset, window_size.HEIGHT-player_offset);
    pants.push(rnd_loc);
    timer = 0;
  }

  // Spawns pants in array
  pants.forEach((o) => {
    char("b", o);
    let choice = floor(rnd(0,2));
    if(choice == 0) chase_player(o);
    else if (choice == 1)do_random_shit(o);
  });
  
  // Checks to see if player gets hit by pants
  if(char("a", player.pos).isColliding.char.b) { player.hitpoints--; console.log(player.hitpoints); }

  // Lose conditions for Game over screen
  if(char("a", player.pos).isColliding.char.b && player.hitpoints <= 0) { 
    timer = 0;
    remove(pants, (obst) => { return true; });
    end(); 
  }

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