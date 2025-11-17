
import React from 'react';
import { InstructionStepData } from './types';
import Header from './components/Header';
import InstructionStep from './components/InstructionStep';
import Footer from './components/Footer';

// The entire tutorial is now statically defined here.
const tutorialSteps: InstructionStepData[] = [
  {
    title: "第一步：准备 WSL 开发环境",
    description: "首先，我们需要为 C++ 图形开发安装所有必要的工具和库。这包括 C++ 编译器 (g++)、构建工具 (CMake, make)、版本控制工具 (Git) 以及 ImGui 依赖的图形库 (GLFW 和 OpenGL)。在您的 WSL 终端中运行以下命令来一次性安装所有依赖：",
    code: `sudo apt update && sudo apt install -y build-essential git cmake libglfw3-dev libgl1-mesa-dev xorg-dev`,
    language: 'bash',
  },
  {
    title: "第二步：获取 ImGui 源代码",
    description: "ImGui 是一个库，我们需要将其源代码下载到我们的项目中。我们将使用 Git 直接从 ImGui 的官方 GitHub 仓库克隆。使用 `--recurse-submodules` 参数可以确保同时下载 ImGui 依赖的 GLFW 和 OpenGL 后端实现文件。",
    code: `git clone --recurse-submodules https://github.com/ocornut/imgui.git`,
    language: 'bash',
  },
  {
    title: "第三步：创建项目结构",
    description: "一个良好的项目结构至关重要。我们将创建一个主目录，并在其中放置我们的 C++ 源码文件、CMake 配置文件，以及刚刚下载的 ImGui 库。按照以下命令创建目录和文件：",
    code: `mkdir my_imgui_app
cd my_imgui_app
touch main.cpp CMakeLists.txt
mv ../imgui . # 将刚才下载的 imgui 文件夹移动到项目目录中`,
    language: 'bash',
  },
  {
    title: "第四步：编写 CMake 构建脚本",
    description: "`CMakeLists.txt` 文件告诉编译器如何构建我们的项目。您可以把它想象成 C++ 世界的 `package.json` + `webpack.config.js`。它定义了项目名称、需要哪些源文件、以及需要链接哪些库。将以下内容复制到您的 `CMakeLists.txt` 文件中。我已经为每一行都添加了详细的注释。",
    code: `# CMake 最低版本要求
cmake_minimum_required(VERSION 3.10)

# 定义项目名称
project(MyImGuiApp)

# 设置 C++ 标准为 C++17，这是一个现代且常用的标准
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# ImGui 需要一些特定的编译选项，我们在这里设置
add_definitions(-DIMGUI_IMPL_OPENGL_LOADER_GLAD)

# 将 ImGui 源代码目录添加到我们的项目中
# 这样 CMake 就能找到 ImGui 的内部文件
add_subdirectory(imgui)

# 创建一个可执行文件，名为 "my_imgui_app"，源文件是 main.cpp
add_executable(my_imgui_app main.cpp)

# 这是最关键的一步：链接库
# 告诉 CMake，我们的 "my_imgui_app" 程序需要用到 ImGui, GLFW, 和 OpenGL
# 这就像在 JavaScript 中 import 一个库一样
target_link_libraries(my_imgui_app
    PRIVATE
    imgui         # 链接我们添加的 ImGui 库
    glfw          # 链接系统安装的 GLFW 库用于窗口管理
    GL            # 链接 OpenGL 库用于渲染
)
`,
    language: 'cmake',
  },
  {
    title: "第五步：编写 C++ 应用程序",
    description: "这是我们应用的核心代码。这个简单的程序会创建一个窗口，并使用 ImGui 在窗口中渲染一个经典的 'Hello, world!' 界面。我已经添加了大量的注释来解释每个部分的作用，特别是对于您可能不熟悉的概念。将以下代码复制到您的 `main.cpp` 文件中。",
    code: `// C++ 中, #include 类似于 JavaScript 的 import
// 我们需要引入 ImGui 和它用于渲染的后端文件 (OpenGL3) 以及平台支持文件 (GLFW)
#include "imgui.h"
#include "imgui_impl_glfw.h"
#include "imgui_impl_opengl3.h"
#include <stdio.h>

// 引入 GLFW (用于创建窗口和处理输入) 和 OpenGL (用于图形渲染)
#include <GLFW/glfw3.h>

// 这是一个简单的错误处理回调函数
static void glfw_error_callback(int error, const char* description) {
    fprintf(stderr, "Glfw Error %d: %s\\n", error, description);
}

// 这是我们应用的主函数，程序的入口点
int main(int, char**) {
    // 设置 GLFW 的错误回调
    glfwSetErrorCallback(glfw_error_callback);

    // 初始化 GLFW 库，如果失败则退出程序
    if (!glfwInit())
        return 1;
    
    // 设置 OpenGL 版本 (这里使用 3.3) 和配置
    const char* glsl_version = "#version 330";
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);  // 使用核心模式

    // 创建一个窗口
    // 参数：宽度, 高度, "窗口标题", 监控器 (null 表示普通窗口), 共享 (null)
    GLFWwindow* window = glfwCreateWindow(1280, 720, "Hello ImGui from WSL!", NULL, NULL);
    if (window == NULL)
        return 1; // 如果窗口创建失败，退出

    // 将我们创建的窗口设置为当前的 OpenGL 上下文
    glfwMakeContextCurrent(window);
    // 启用垂直同步 (VSync)，防止画面撕裂
    glfwSwapInterval(1);

    // --- ImGui 设置阶段 ---
    // 创建 ImGui 上下文
    IMGUI_CHECKVERSION();
    ImGui::CreateContext();
    ImGuiIO& io = ImGui::GetIO(); (void)io; // 获取 ImGui 的输入/输出对象

    // 设置 ImGui 的视觉风格，这里使用深色主题
    ImGui::StyleColorsDark();

    // 初始化 ImGui 的平台和渲染器后端
    // 第一个参数是我们的 GLFW 窗口，第二个是是否安装回调 (true)
    ImGui_ImplGlfw_InitForOpenGL(window, true);
    ImGui_ImplOpenGL3_Init(glsl_version);

    // --- 主循环 (Main loop) ---
    // 这非常像 Web 开发中的 requestAnimationFrame 循环
    // 只要窗口没有被要求关闭，这个循环就会一直运行
    while (!glfwWindowShouldClose(window)) {
        // 轮询事件，比如鼠标移动、键盘按键等
        glfwPollEvents();

        // --- ImGui 帧准备 ---
        // 告诉 ImGui 新的一帧要开始了
        ImGui_ImplOpenGL3_NewFrame();
        ImGui_ImplGlfw_NewFrame();
        ImGui::NewFrame();

        // --- 渲染你的 ImGui 界面 ---
        // 在这里定义所有你想要显示的窗口和控件
        {
            // 开始定义一个名为 "Hello, world!" 的 ImGui 窗口
            ImGui::Begin("Hello, world!");

            // 在窗口里添加一些文本
            ImGui::Text("This is some useful text.");
            
            // 添加一个按钮
            if (ImGui::Button("Click Me")) {
                // 这个代码块里的内容会在按钮被点击时执行
                printf("Button clicked!\\n");
            }
            
            // 结束当前 ImGui 窗口的定义
            ImGui::End();
        }

        // --- 渲染阶段 ---
        // 准备将 ImGui 的绘图数据渲染到屏幕上
        ImGui::Render();
        int display_w, display_h;
        glfwGetFramebufferSize(window, &display_w, &display_h); // 获取窗口大小
        glViewport(0, 0, display_w, display_h); // 设置视口
        
        // 设置清屏颜色 (这里是深蓝色)
        glClearColor(0.1f, 0.1f, 0.2f, 1.0f);
        // 清除颜色缓冲区
        glClear(GL_COLOR_BUFFER_BIT);

        // 实际执行 ImGui 的渲染指令
        ImGui_ImplOpenGL3_RenderDrawData(ImGui::GetDrawData());
        
        // 交换前后缓冲区，将我们画好的内容显示在屏幕上
        glfwSwapBuffers(window);
    }

    // --- 清理阶段 ---
    // 当主循环退出后，我们需要清理并释放所有资源
    ImGui_ImplOpenGL3_Shutdown();
    ImGui_ImplGlfw_Shutdown();
    ImGui::DestroyContext();

    glfwDestroyWindow(window);
    glfwTerminate();

    return 0; // 程序正常退出
}
`,
    language: 'cpp',
  },
  {
    title: "第六步：编译您的应用",
    description: "现在所有代码和配置文件都准备好了，我们可以编译项目了。我们通常会创建一个单独的 `build` 目录来存放编译过程中生成的中间文件和最终的可执行文件，以保持项目根目录的整洁。",
    code: `mkdir build
cd build
cmake ..
make`,
    language: 'bash',
  },
  {
    title: "第七步：运行您的第一个 ImGui 应用",
    description: "如果 `make` 命令成功完成，您会在 `build` 目录下找到一个名为 `my_imgui_app` 的可执行文件。运行它！得益于 WSLg，Windows 会自动处理图形界面的显示。您应该能看到一个带有 'Hello, world!' 标题的窗口。",
    code: `./my_imgui_app`,
    language: 'bash',
  },
];

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-12">
          {tutorialSteps.map((step, index) => (
            <InstructionStep key={index} step={step} index={index + 1} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
