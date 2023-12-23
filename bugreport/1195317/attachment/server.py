from http.server import HTTPServer, BaseHTTPRequestHandler
import string

class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):
	file_name = ""

	def do_POST(self):
		body = self.rfile.read(int(self.headers.get('content-length')))

		self.send_response(200)
		self.end_headers()

		self.wfile.write(body)

	def do_GET(self):
		self.send_response(200)
		self.end_headers()
		body = """
		<html>
			<form enctype="multipart/form-data" method="post" action="/upload">
			  <input type="file" id="myFile" name="CHOOSE FILE">
			  <input type="submit" value="Upload Image" name="submit">
			</form>
		</html>
		"""

		self.wfile.write(body.encode())


httpd = HTTPServer(('localhost', 8080), SimpleHTTPRequestHandler)
httpd.serve_forever()
