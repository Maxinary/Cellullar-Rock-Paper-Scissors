#!/bin/sh

rm -r target/
mkdir target
cp ./* target 2>/dev/null

cp node_modules/gif.js.optimized/dist/* target/

./run.sh
