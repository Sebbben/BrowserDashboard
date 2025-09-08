docker build --quiet -t browser-dash:latest .
docker run --rm -p 1271:3000 --volume ./src:/app browser-dash:latest