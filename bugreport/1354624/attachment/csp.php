<?php
  header("Content-Security-Policy: sandbox allow-scripts allow-same-origin;");
?>
<html>
    <body>
        <button onclick="parent.location = 'https://example.com'">location</button>
        <button onclick="parent.navigation.navigate('https://example.com')">navigate</button>
    </body>
</html>