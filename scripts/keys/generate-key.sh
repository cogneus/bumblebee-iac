outFile=$1
openssl genrsa -aes256 -out private_key.pem 2048
openssl pkcs8 -topk8 -in private_key.pem -out ${outFile} -nocrypt
rm private_key.pem