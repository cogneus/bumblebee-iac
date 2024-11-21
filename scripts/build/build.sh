npm run build -w bumblebee-common
npm run build -w bumblebee-services

function build {
  file=$1
  name=${file#*handlers/}
  name=${name%.*}
  esbuild $file \
    --bundle --outfile=dist/$name/index.js --platform=node --external:@aws-sdk/* --minify --tree-shaking=true
}

for file in ./packages/auth/src/handlers/*; do
  build $file
done

for file in ./packages/api/src/handlers/*; do
  build $file
done

tsc