#!/bin/bash
dir=$(pwd)
cd $(git rev-parse --show-toplevel)
husky install ${dir}/scripts/.husky
cd ${dir}
