# CMake 最低版本要求
cmake_minimum_required(VERSION 3.15)

# 项目名称
project(MyImGuiApp)

# 设置 C++ 标准为 C++17，这是一个现代且兼容性好的标准
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# 引入 CMake 的 FetchContent 模块，用于下载依赖
include(FetchContent)

# 声明 Dear ImGui 依赖
# 我们从 GitHub 上获取它，并指定一个稳定的版本标签，以保证可复现性
FetchContent_Declare(
    imgui
    GIT_REPOSITORY https://github.com/ocornut/imgui.git
    GIT_TAG v1.90.1 # 使用一个具体的版本号是个好习惯
)

# 让 FetchContent 真正去下载和准备好 ImGui
FetchContent_MakeAvailable(imgui)

# 查找我们通过 apt 安装的 GLFW 和 OpenGL 库
find_package(glfw3 REQUIRED)
find_package(OpenGL REQUIRED)

# 添加我们的主程序可执行文件，它由 main.cpp 编译而来
add_executable(my_imgui_app main.cpp)

# 将 ImGui 的源文件也添加到我们的项目中
# 我们需要核心文件，以及 GLFW (平台后端) 和 OpenGL3 (渲染后端) 的实现文件
target_sources(my_imgui_app PRIVATE
    ${imgui_SOURCE_DIR}/imgui.cpp
    ${imgui_SOURCE_DIR}/imgui_draw.cpp
    ${imgui_SOURCE_DIR}/imgui_tables.cpp
    ${imgui_SOURCE_DIR}/imgui_widgets.cpp
    ${imgui_SOURCE_DIR}/backends/imgui_impl_glfw.cpp
    ${imgui_SOURCE_DIR}/backends/imgui_impl_opengl3.cpp
)

# 告诉编译器去哪里找头文件 (.h 文件)
# 这样我们在 main.cpp 中才能 #include "imgui.h"
target_include_directories(my_imgui_app PRIVATE
    ${imgui_SOURCE_DIR}
    ${imgui_SOURCE_DIR}/backends
)

# 最后，将所有东西链接在一起！
# 我们的程序需要链接 ImGui, GLFW, 和 OpenGL 才能工作
target_link_libraries(my_imgui_app PRIVATE
    # imgui
    glfw
    OpenGL::GL
)
