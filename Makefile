all: clean build

build:
	zip SqueakJSApp -@ < bundle.txt

clean:
	rm -f SqueakJSApp.zip
