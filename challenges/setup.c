#include <unistd.h>
#include <fcntl.h>
#include <sys/stat.h>

#define USER "/home/appuser/"

void make_file(const char *name) {
    int fd = open(name, O_CREAT | O_WRONLY, S_IRUSR | S_IWUSR);
    close(fd);    
}

void make_dir(const char *name) {
    mkdir(name, S_IRWXU | S_IRWXG | S_IROTH | S_IXOTH);
}


void one() {
    chdir(USER);
    make_dir("Books");
    make_dir("Movies");
    make_dir("Music");

    chdir(USER"Books");
    make_file("OSTEP.pdf");
    make_file("The_C_Programming_Language.pdf");

    chdir(USER"Movies");
    make_file("Pulp_Fictio1n.mp4");
    make_file("CSE29_SP25_LEC1.mp4");
    make_file("TopGun.mp4");

    chdir(USER"Music");
    make_file("Bohemian_Rhapsody.mp3");
    make_file("Blinding_Lights.mp3");
    make_file("Hurry_Up_Tomorrow.mp3");

    return;
}


void two() {
    chdir(USER);
    int in = open("/resources/lorem.txt", O_RDONLY);
    
    char name[8] = "0.txt";

    off_t offset = 0;

    for (int i = 0; i < 20; i++) {
        name[0] = i + '1';
        int out = open(name, O_CREAT | O_WRONLY, S_IRUSR | S_IWUSR);
        copy_file_range(in, offset, out, NULL, 100, 0);
        close(out);
    }

    close(in);
    return;
}


void three() {

    chdir(USER);
    char name[8] = "0.txt";
    for (int i = 0; i < 10; i++) {
        name[0] = i + '1';
        int fd = open(name, O_WRONLY | O_CREAT | O_TRUNC, 0644);
        int size = (i + 1) * 100 * 1024;
        char buffer[4096];
        for (int j = 0; j < sizeof(buffer); j++) {
            buffer[j] = 'a' + (j % 26);
        }
        while (size > 0) {
            int chunk = (size < sizeof(buffer)) ? size : sizeof(buffer);
            write(fd, buffer, chunk);
            size -= chunk;
        }
        close(fd);
    }

    return;

}


void four() {
    chdir(USER);
    int in = open("/resources/foo.txt", O_RDONLY);
    int out = open("foo.txt", O_CREAT | O_WRONLY, S_IRUSR | S_IWUSR);
    copy_file_range(in, NULL, out, NULL, 81, 0);
    close(in);
    close(out);
    return;
}


void five() {
    chdir(USER);
    int in = open("/resources/wc.txt", O_RDONLY);
    int out = open("file.txt", O_CREAT | O_WRONLY, S_IRUSR | S_IWUSR);
    copy_file_range(in, NULL, out, NULL, 131, 0);
    close(in);
    close(out);    
    return;
}


int main() {

    int fd = open("/proc/self/cmdline", O_RDONLY);
    char buf[16];
    int n = read(fd, buf, sizeof(buf) - 1);
    buf[n] = '\0';
    close(fd);

    char *arg = buf;

    while(*arg) {
        ++arg;
        //printf("arg: %s\n", arg);
    }

    ++arg;

    //printf("arg: %s\n", arg);

    

    if (*arg == '1') {
        one();
    } else if (*arg == '2') {
        two();
    } else if (*arg == '3') {
        three();
    } else if (*arg == '4') {
        four();
    } else if (*arg == '5') {
        five();
    }
    else {
        return 1;
    }
    return 0;

}
