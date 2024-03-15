#!/bin/bash

echo "Starting replica set initialize"
until mongosh --eval "print(\"waited for connection\")"
do
    sleep 2
done
echo "Connection finished"
echo "Creating replica set"
mongosh <<EOF
var config = {
    "_id": "dbrs",
    "version": 1,
    "members": [
        {
            "_id": 1,
            "host": "192.168.15.114:4017",
            "priority": 3
        },
        {
            "_id": 2,
            "host": "192.168.15.114:4018",
            "priority": 2
        },
        {
            "_id": 3,
            "host": "192.168.15.114:4019",
            "priority": 1
        }
    ]
};
rs.initiate(config, { force: true });
rs.status();
EOF