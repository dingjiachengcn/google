// Copyright 2018 The Chromium OS Authors. All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
//    * Redistributions of source code must retain the above copyright
// notice, this list of conditions and the following disclaimer.
//    * Redistributions in binary form must reproduce the above
// copyright notice, this list of conditions and the following disclaimer
// in the documentation and/or other materials provided with the
// distribution.
//    * Neither the name of Google Inc. nor the names of its
// contributors may be used to endorse or promote products derived from
// this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

// libfuzzer-based fuzzer for public APIs.

#include <assert.h>
#include <stdint.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

#include <epoxy/egl.h>

#include "util/macros.h"
#include "virglrenderer.h"

int LLVMFuzzerTestOneInput(const uint8_t* data, size_t size);

#ifndef CLEANUP_EACH_INPUT
// eglInitialize leaks unless eglTeriminate is called (which only happens
// with CLEANUP_EACH_INPUT), so suppress leak detection on everything
// allocated by it.
const char* __lsan_default_suppressions(void);
const char* __lsan_default_suppressions() {
   return "leak:eglInitialize\n";
}

#endif // !CLEANUP_EACH_INPUT

struct fuzzer_cookie
{
   EGLDisplay display;
   EGLConfig egl_config;
   EGLContext ctx;
};

static void fuzzer_write_fence(UNUSED void *opaque, UNUSED uint32_t fence)
{
}

static virgl_renderer_gl_context fuzzer_create_gl_context(
      void *cookie, UNUSED int scanout_idx,
      struct virgl_renderer_gl_ctx_param *param)
{
   struct fuzzer_cookie *cookie_data = cookie;
   EGLContext shared = param->shared ? eglGetCurrentContext() : NULL;
   const EGLint context_attribs[] = { EGL_CONTEXT_CLIENT_VERSION, 3,
                                      EGL_NONE };
   EGLContext ctx = eglCreateContext(cookie_data->display,
                                     cookie_data->egl_config,
                                     shared,
                                     context_attribs);
   assert(ctx);

   return ctx;
}

static void fuzzer_destroy_gl_context(void *cookie,
                                      virgl_renderer_gl_context ctx)
{
   struct fuzzer_cookie *cookie_data = cookie;
   eglDestroyContext(cookie_data->display, ctx);
}

static int fuzzer_make_current(UNUSED void *cookie, UNUSED int scanout_idx,
                               UNUSED virgl_renderer_gl_context ctx)
{
   return 0;
}

const int FUZZER_CTX_ID = 1;
const char *SWRAST_ENV = "LIBGL_ALWAYS_SOFTWARE";

static struct fuzzer_cookie cookie;

static struct virgl_renderer_callbacks fuzzer_cbs = {
   .version = 1,
   .write_fence = fuzzer_write_fence,
   .create_gl_context = fuzzer_create_gl_context,
   .destroy_gl_context = fuzzer_destroy_gl_context,
   .make_current = fuzzer_make_current,
};

static bool initialized = false;

static int initialize_environment()
{
   if (!initialized) {
      EGLBoolean ok;

      // Force SW rendering unless env variable is already set.
      setenv(SWRAST_ENV, "true", 0);

      cookie.display = eglGetDisplay(EGL_DEFAULT_DISPLAY);
      assert(cookie.display != EGL_NO_DISPLAY);

      ok = eglInitialize(cookie.display, NULL, NULL);
      assert(ok);

      const EGLint config_attribs[] = { EGL_SURFACE_TYPE, EGL_DONT_CARE,
                                        EGL_NONE };
      EGLint num_configs;
      ok = eglChooseConfig(cookie.display, config_attribs,
                           &cookie.egl_config, 1, &num_configs);
      assert(ok);

      ok = eglBindAPI(EGL_OPENGL_ES_API);
      assert(ok);

      const EGLint context_attribs[] = { EGL_CONTEXT_CLIENT_VERSION, 3,
                                         EGL_NONE };
      cookie.ctx = eglCreateContext(cookie.display, cookie.egl_config,
                                    EGL_NO_CONTEXT, context_attribs);
      assert(cookie.ctx != EGL_NO_CONTEXT);

      ok = eglMakeCurrent(cookie.display, EGL_NO_SURFACE, EGL_NO_SURFACE,
                          cookie.ctx);
      assert(ok);

      initialized = true;
   }

   return FUZZER_CTX_ID;
}

#ifdef CLEANUP_EACH_INPUT
static void cleanup_environment()
{
   if (cookie.ctx != EGL_NO_CONTEXT) {
      eglMakeCurrent(cookie.display, NULL, NULL, NULL);
      eglDestroyContext(cookie.display, cookie.ctx);
   }

   if (cookie.display != EGL_NO_DISPLAY) {
      eglTerminate(cookie.display);
   }

   initialized = false;
}
#endif

int LLVMFuzzerTestOneInput(const uint8_t* data, size_t size)
{
   uint32_t ctx_id = initialize_environment();
   int ret;

   // There are trade-offs here between ensuring that state is not persisted
   // between invocations of virgl_renderer_submit_cmd, and to avoid leaking
   // resources that comes with repeated dlopen()/dlclose()ing the mesa
   // driver with each eglInitialize()/eglTerminate() if CLEANUP_EACH_INPUT
   // is set.

   ret = virgl_renderer_init(&cookie, 0, &fuzzer_cbs);
   assert(!ret);

   const char *name = "fuzzctx";
   ret = virgl_renderer_context_create(ctx_id, strlen(name), name);
   assert(!ret);

   char *vrend_renderer_resource_create_args = "\x30\x00\x0b\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x02\x00\x00\x00\x00\x00\x01\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00";
   ret = virgl_renderer_submit_cmd((void *) vrend_renderer_resource_create_args, ctx_id, 12);	// vrend_decode_pipe_resource_create

   assert(!ret);

   ret = virgl_renderer_resource_create_blob(&(struct virgl_renderer_resource_create_blob_args){
      .res_handle = 0x100,
      .ctx_id = ctx_id,
      .size = 0x1000,
      .blob_mem = VIRGL_RENDERER_BLOB_MEM_HOST3D,
   });
   assert(!ret);
   
   virgl_renderer_ctx_attach_resource(ctx_id, 0x100);

   char *set_atomic_buffers = "\x23\x00\x07\x00\x05\x00\x00\x00\x02\x00\x00\x00\x00\x00\x00\x10\x00\x02\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00";
   virgl_renderer_submit_cmd(set_atomic_buffers, ctx_id, 8); // vrend_set_single_image_view

   virgl_renderer_context_destroy(ctx_id);

   virgl_renderer_cleanup(&cookie);

#ifdef CLEANUP_EACH_INPUT
   // The following cleans up between each input which is a lot slower.
   cleanup_environment();
#endif

   return 0;
}