#!/bin/sh

# Initialize data directory if empty
if [ ! "$(ls -A /app/data 2>/dev/null)" ]; then
    echo "Data directory is empty, initializing from seed data..."
    cp -r /app/seed-data/* /app/data/
    echo "Data initialization complete."
else
    echo "Data directory already contains data, skipping initialization."
fi

# Start the backend application
exec ./backend
