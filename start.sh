if ! pgrep -x "node" > /dev/null
then
    echo 'starting'
    # comment out below to turn off auto ressurect
    cd /bot && node index.js > /dev/null 2>&1 &
else
    echo 'running'
fi
