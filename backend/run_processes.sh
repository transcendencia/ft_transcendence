#!/bin/bash

chmod +x run_server.sh
chmod +x run_logout.sh

./run_server.sh &
./run_logout.sh &

# Wait for all background processes to finish
wait