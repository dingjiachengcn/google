/*
Put it in the samples directory and build to modifying BUILD.gn.
*/

#include <stdint.h>
#include <list>
#include <memory>
#include <string>

#include "util/shader_utils.cpp"

#include "common/system_utils.h"
#include "util/EGLPlatformParameters.h"
#include "util/OSWindow.h"
#include "util/Timer.h"
#include "util/egl_loader_autogen.h"

#include "util/EGLWindow.h"
#include "util/gles_loader_autogen.h"
#include "util/random_utils.h"
#include "util/test_utils.h"

#include <string.h>
#include <iostream>
#include <utility>

using namespace std;
using namespace angle;

int main(int argc, char **argv)
{
    //program init, before setSwapInterval
    OSWindow *mOSWindow = OSWindow::New();
    EGLWindow *mEGLWindow = EGLWindow::New(3, 0);

    std::unique_ptr<angle::Library> mEntryPointsLib;
    mEntryPointsLib.reset(angle::OpenSharedLibrary("libEGL", angle::SearchType::ApplicationDir));

    if (!mOSWindow->initialize("test", 500, 500))
    {
        cout << "init failed" << endl;
        return -1;
    }

    //mOSWindow->setVisible(true);

    ConfigParameters configParams;
    configParams.redBits     = 8;
    configParams.greenBits   = 8;
    configParams.blueBits    = 8;
    configParams.alphaBits   = 8;
    configParams.depthBits   = 24;
    configParams.stencilBits = 8;

    EGLPlatformParameters mPlatformParams;
    mPlatformParams.renderer = EGL_PLATFORM_ANGLE_TYPE_VULKAN_ANGLE;
//	mPlatformParams.renderer = EGL_PLATFORM_ANGLE_TYPE_OPENGLES_ANGLE;
    mPlatformParams.deviceType = EGL_PLATFORM_ANGLE_DEVICE_TYPE_SWIFTSHADER_ANGLE;
//	mPlatformParams.deviceType = EGL_PLATFORM_ANGLE_DEVICE_TYPE_HARDWARE_ANGLE;

    if (!mEGLWindow->initializeGL(mOSWindow, mEntryPointsLib.get(), angle::GLESDriverType::AngleEGL, mPlatformParams, configParams))
    {
        cout << "initializeGL failed" << endl;
        return -1;
    }

    // Disable vsync
    if (!mEGLWindow->setSwapInterval(0))
    {
        cout << "setSwapInterval failed" << endl;
        return -1;
    }

    GLuint mProgram  = 0;
    constexpr char kVS[] = "void main()\n"
"{\n"
"}\n";

    constexpr char k2DFS[] =
"void main()\n"
"{\n"
"}\n";
    mProgram = CompileProgram(kVS, k2DFS);

    glUseProgram(mProgram);

    //trigger to crash
    glTexImage2D(GL_TEXTURE_2D, 0x0, GL_RGB10_A2, 0x525, 0x52d, 0x0, GL_RGBA, GL_UNSIGNED_INT_2_10_10_10_REV, (void*)0x41424344);

    mEGLWindow->destroyGL();
    mOSWindow->destroy();
    return 0;
}
