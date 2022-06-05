#!/bin/sh
if [ -f "target/index.html" ]; then
  cd target/
  python3 -m http.server
else
  echo "Project not yet built. Try running build.sh"
fi
