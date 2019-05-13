#!/bin/sh

set -x
set -o nounset

server_url() {
    echo "Replacing BACKEND_SERVER_URL with $1 in /usr/share/nginx/html/index.html"
    sed -i -e 's@const BACKEND_SERVER_URL=null;@const BACKEND_SERVER_URL="'"$1"'";@g' /usr/share/nginx/html/index.html
}

if [ ! -z "$BACKEND_SERVER_URL" ]; then
  server_url "$BACKEND_SERVER_URL"
fi

echo "Running $@"

exec "$@"
