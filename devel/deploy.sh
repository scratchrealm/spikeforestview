#!/bin/bash

set -ex

TARGET=gs://figurl/spikeforestview-1

yarn build
gsutil -m cp -R ./build/* $TARGET/