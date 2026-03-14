# Start a local node http server using encryption

    http-server -S -C ../server/cert.pem -K ../server/key.pem -p 8000

# ubuntu

    npx http-server -S -C ../server/cert.pem -K ../server/key.pem -p 8000

The cert and key are reused from the server. Replace them with whereever you have the server keys.

# extend tileset after changes..

tile-extruder --tileWidth 32 --tileHeight 32 --input ./castle.png --output ./castle_ex.png

# Extending