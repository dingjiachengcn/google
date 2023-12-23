#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include <linux/loop.h>
#include <linux/fs.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <sys/ioctl.h>
#include <fcntl.h>

int main(int argc, char** argv) {
    if (argc != 3) {
        printf("Usage:\n %s LOOP_DEV NEW_IMAGE\n", argv[0]);
        exit(1);
    }

    // First, get the loop device and info.

    int loop_fd;
    loop_fd = open(argv[1], O_RDONLY);
    if (loop_fd < 0) {
        perror("Cannot open loop device");
        exit(1);
    }

    struct loop_info64 loop_info;
    if (ioctl(loop_fd, LOOP_GET_STATUS64, &loop_info) < 0) {
        perror("Cannot get loop device status");
        exit(1);
    }

    size_t loop_size;
    // Note, BLKGETSIZE64 returns in bytes, not in blocks.
    if (ioctl(loop_fd, BLKGETSIZE64, &loop_size) < 0) {
        perror("Cannot get loop device size");
        exit(1);
    }

    // Then, get the new backing image and info.

    // Open read/write incase we need to extend below.
    int src_fd;
    src_fd = open(argv[2], O_RDWR);
    if (src_fd < 0) {
        perror("Cannot open new image");
        exit(1);
    }

    struct stat src_stat;
    if (fstat(src_fd, &src_stat) != 0) {
        perror("Cannot stat new image");
        exit(1);
    }

    // If the new image is too short then extend it.
    if (src_stat.st_size < loop_size) {
        if (ftruncate(src_fd, loop_size) != 0) {
            perror("Failed to extend new image");
            exit(1);
        }
    }

    // If required, make sure the size limit is equal or smaller than the
    // current loop size. This way we force the "same size" check to pass.
    if (loop_info.lo_sizelimit == 0 || loop_info.lo_sizelimit > loop_size) {
        loop_info.lo_sizelimit = loop_size;
        if (ioctl(loop_fd, LOOP_SET_STATUS64, &loop_info) < 0) {
            perror("Cannot set loop device size limit");
            exit(1);
        }
    }

    // Swap the new image in underneath.
    if (ioctl(loop_fd, LOOP_CHANGE_FD, src_fd) < 0) {
        perror("Failed to swap backing");
        exit(1);
    }

    // Release the our size limit.
    loop_info.lo_sizelimit = 0;
    if (ioctl(loop_fd, LOOP_SET_STATUS64, &loop_info) < 0) {
        perror("Failed remove loop device size limit");
        exit(1);
    }

    // Resize the loop device.
    if (ioctl(loop_fd, LOOP_SET_CAPACITY, 0) < 0) {
        perror("Failed to resize the loop device");
        exit(1);
    }

    // And try to invalide as much as possible.
    int drop_caches_fd = open("/proc/sys/vm/drop_caches", O_WRONLY);
    if (write(drop_caches_fd, "3", 1) != 1) {
        perror("Failed to drop caches");
        exit(1);
    }

    exit(0);
}
