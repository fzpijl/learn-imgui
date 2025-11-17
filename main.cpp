// 引入必要的头文件
#include "imgui.h"
#include "imgui_impl_glfw.h"
#include "imgui_impl_opengl3.h"
#include <stdio.h>

// 引入 OpenGL 和 GLFW 的头文件
// GLAD/GLEW 也可以，但对于简单的应用，GLFW 自带的足够了
#define GL_SILENCE_DEPRECATION // 在 macOS 上需要，但在 WSL 上无害
#include <GLFW/glfw3.h>

// C++程序的入口点
int main(int, char **) {
  // --- 步骤 1: 初始化 GLFW 和 创建一个窗口 ---
  // GLFW 是一个帮助我们创建窗口、处理用户输入（键盘、鼠标）的库
  // 把它想象成创建了一个“浏览器”窗口
  if (!glfwInit())
    return 1;

  // 设置 OpenGL 版本 (这里使用 3.3)
  const char *glsl_version = "#version 330";
  glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
  glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
  glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE); // 使用核心模式

  // 创建窗口
  GLFWwindow *window =
      glfwCreateWindow(1280, 720, "My First ImGui App", NULL, NULL);
  if (window == NULL)
    return 1;
  glfwMakeContextCurrent(window);
  glfwSwapInterval(1); // 启用 VSync (垂直同步)

  // --- 步骤 2: 初始化 ImGui ---
  // 这是 ImGui 的设置过程
  IMGUI_CHECKVERSION();
  ImGui::CreateContext();
  ImGuiIO &io = ImGui::GetIO();
  (void)io;
  // io.ConfigFlags |= ImGuiConfigFlags_NavEnableKeyboard; // 启用键盘控制
  // (可选) io.ConfigFlags |= ImGuiConfigFlags_NavEnableGamepad;  //
  // 启用手柄控制 (可选)

  // 设置 ImGui 的风格，这里使用深色主题
  ImGui::StyleColorsDark();

  // 初始化 ImGui 的 "后端"
  // 这部分是胶水代码，告诉 ImGui 如何与我们的窗口 (GLFW) 和渲染器 (OpenGL) 对话
  ImGui_ImplGlfw_InitForOpenGL(window, true);
  ImGui_ImplOpenGL3_Init(glsl_version);

  // --- 步骤 3: 主循环 (The "Game Loop") ---
  // 这是应用程序的核心。它会一直循环，直到用户关闭窗口
  // 在网页开发中，这类似于 requestAnimationFrame 循环
  while (!glfwWindowShouldClose(window)) {
    // 处理用户输入事件，比如鼠标移动、键盘按键
    glfwPollEvents();

    // 告诉 ImGui 后端我们要开始新的一帧了
    ImGui_ImplOpenGL3_NewFrame();
    ImGui_ImplGlfw_NewFrame();
    ImGui::NewFrame();

    // --- 步骤 4: 编写你的 ImGui 界面代码 ---
    // 这是最有趣的部分！所有的 UI 元素都在这里定义。
    // ImGui 使用“立即模式”，意味着你每一帧都在描述你想要的 UI
    // 而不是像网页 DOM 那样创建一次对象。

    // 创建一个名为 "Hello, world!" 的窗口
    ImGui::Begin("Hello, world!");

    // 添加一个文本元素
    ImGui::Text("This is some useful text.");

    // 定义一个静态变量来追踪按钮点击次数
    // 'static' 关键字意味着这个变量只会被初始化一次，并在函数调用之间保持它的值
    // 如果不用 static, counter 会在每一帧都被重置为 0
    static int counter = 0;

    // 添加一个按钮。ImGui::Button 函数会绘制按钮，
    // 并且如果按钮在这一帧被点击了，它会返回 true。
    if (ImGui::Button("Click Me")) {
      counter++; // 如果按钮被点击，计数器加 1
    }

    // 你可以在同一行添加多个元素
    ImGui::SameLine();

    // 显示计数器的当前值
    ImGui::Text("counter = %d", counter);

    // 结束当前窗口的定义
    ImGui::End();

    // --- 步骤 5: 渲染 ---
    // 这部分负责将你上面定义的 UI 真正地画到屏幕上

    // 1. 获取窗口的尺寸
    int display_w, display_h;
    glfwGetFramebufferSize(window, &display_w, &display_h);
    glViewport(0, 0, display_w, display_h);

    // 2. 设置清屏颜色 (这里是深蓝色) 并清除屏幕
    ImVec4 clear_color = ImVec4(0.1f, 0.1f, 0.2f, 1.00f);
    glClearColor(clear_color.x, clear_color.y, clear_color.z, clear_color.w);
    glClear(GL_COLOR_BUFFER_BIT);

    // 3. 渲染 ImGui 的绘制数据
    ImGui::Render();
    ImGui_ImplOpenGL3_RenderDrawData(ImGui::GetDrawData());

    // 4. 将我们绘制好的后台缓冲区交换到前台显示出来
    glfwSwapBuffers(window);
  }

  // --- 步骤 6: 清理 ---
  // 在退出前，释放所有分配的资源，这是一个好习惯
  ImGui_ImplOpenGL3_Shutdown();
  ImGui_ImplGlfw_Shutdown();
  ImGui::DestroyContext();

  glfwDestroyWindow(window);
  glfwTerminate();

  return 0;
}