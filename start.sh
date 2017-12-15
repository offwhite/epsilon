if ! pgrep -x "node" > /dev/null
then
    echo 'starting'
    #cd /bot && sudo node index.js > /dev/null 2>&1 &
else
    echo 'running'
fi
