build: src
	babel --presets 'quiver-babel/node-preset' --out-dir dist src

test: build
	node test

.PHONY: build test
