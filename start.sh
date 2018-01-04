if ! pgrep -x "node" > /dev/null
then
    echo 'starting'
    cd /bot && node index.js > /dev/null 2>&1 &
fi

if ! pgrep -x "homebridge" > /dev/null
then
    echo 'starting homebridge'
    homebridge > /dev/null 2>&1 &
fi
