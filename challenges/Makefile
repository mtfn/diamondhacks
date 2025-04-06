# compile using musl-gcc and run docker build -t alpine .

cc = musl-gcc
cflags = -static 

a: setup.c
	$(cc) $(cflags) -o a setup.c
	docker build -t alpine .

docker: 
	docker build -t alpine .

clean:
	rm -f a