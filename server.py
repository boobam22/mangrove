from http.server import SimpleHTTPRequestHandler
from socketserver import TCPServer
from pathlib import Path

DIST = "dist"
PORT = 8000


class VueRouterHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST, **kwargs)

    def do_GET(self):
        file_path = Path(DIST, self.path.lstrip("/"))
        if not file_path.exists() or file_path.is_dir():
            self.path = "/index.html"
        return super().do_GET()


def main():
    TCPServer.allow_reuse_address = True
    with TCPServer(("", PORT), VueRouterHandler) as httpd:
        print(f"Serving on http://localhost:{PORT}")
        httpd.serve_forever()


if __name__ == "__main__":
    main()
