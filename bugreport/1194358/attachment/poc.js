function f ( ) { 
  return arguments ; 
} 
var var14 = [ ] ; 
var14 . length = 0x1000 ; 
var var11 = f . bind ( null , ... var14 ) ; 
function var7 ( ) { } 
function f ( ) { 
  for ( let i = 1 ; i < 2 ; i ++ ) { 
    function var4 ( var12 ) { 
      async function var8 ( ) { var14 ( ); print(0x20a0a0);} 
      for (var j = 0; j < 1000; j++) {
        var8();
      }
    } 
    var4 ( ); 
    var14 = ( var11 ) ; 
  } 
} 
for(var j = 0; j < 1000; j++) {
  f();
}
