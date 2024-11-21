npm run build -w bumblebee-common
npm run build -w bumblebee-services

for file in ./packages/auth/src/handlers/*; do
  esbuild $file \
    --bundle --outdir=dist --platform=node --external:@aws-sdk/* --minify --tree-shaking=true
done

for file in ./packages/api/src/handlers/*; do
  esbuild $file \
    --bundle --outdir=dist --platform=node --external:@aws-sdk/* --minify --tree-shaking=true
done

tsc