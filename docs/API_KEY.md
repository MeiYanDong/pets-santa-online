# 创建图片编辑

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /v1/images/edits:
    post:
      summary: 创建图片编辑
      deprecated: false
      description: >-
        更新: 

        - 新上线 gemini-3-pro-image-preview-hd 香蕉2  4k 分辨率

        - 图片清晰度高，单张图片体积约 **3 MB**

        #### 最强绘图模型 nano banana 2 （相较于 1 代）

        - 中文显示效果非常出色，适合中文海报、文案类图片

        - 图片清晰度高，单张图片体积约 **1.5 MB**

        - 使用建议：** default 分组推荐走「 chat/ generations / edit 接口」**，稳定性与效果更佳
                              ** 原价 分组**  返回 base64 格式
        ---

        [小白开箱即用教程（一步一步教你用）](https://wiki.tu-zi.com/s/8c61a536-7a59-4410-a5e2-8dab3d041958/doc/gemini-3-pro-image-preview-api-wCmFtI3Tm5)
      tags:
        - 图片生成/nano-banana/image/generations 格式(dalle 格式)
      parameters:
        - name: Authorization
          in: header
          description: ''
          required: false
          example: Bearer {{YOUR_API_KEY}}
          schema:
            type: string
      requestBody:
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                model:
                  example: gemini-3-pro-image-preview
                  type: string
                prompt:
                  description: 所需图像的文本描述。最大长度为 1000 个字符。
                  example: merge two images
                  type: string
                image:
                  description: 要编辑的图像。
                  example:
                    - >-
                      file:///Users/xiangsx/Downloads/assets_task_01jqx6n1rde45tkxn5g99eq3b2_src_0
                      (1).png
                    - >-
                      file:///Users/xiangsx/Downloads/assets_task_01jqgab5ghejwazz6vjk89q27c_src_0.png
                  type: string
                  format: binary
                'n':
                  description: 要生成的图像数。必须介于 1 和 10 之间。
                  example: '1'
                  type: string
                response_format:
                  description: 生成的图像返回的格式。必须是`url`或`b64_json`。
                  example: url
                  type: string
                mask:
                  description: 附加图像，其完全透明区域（例如，alpha 为零的区域）
                  example: file:///Users/xiangsx/Downloads/下载.png
                  type: string
                  format: binary
                user:
                  description: >-
                    代表您的最终用户的唯一标识符，可以帮助 OpenAI
                    监控和检测滥用行为。[了解更多](https://platform.openai.com/docs/guides/safety-best-practices/end-user-ids)。
                  example: ''
                  type: string
                quality:
                  type: string
                  enum:
                    - 1k
                    - 2k
                    - 4k
                  x-apifox-enum:
                    - value: 1k
                      name: ''
                      description: ''
                    - value: 2k
                      name: ''
                      description: ''
                    - value: 4k
                      name: ''
                      description: ''
                  description: 选择图像生成质量（仅对香蕉 2 有效）
                  example: ''
                size:
                  type: string
                  enum:
                    - 1x1
                    - 2x3
                    - 3x2
                    - 3x4
                    - 4x3
                    - 4x5
                    - 5x4
                    - 9x16
                    - 16x9
                    - 21x9
                  x-apifox-enum:
                    - value: 1x1
                      name: ''
                      description: ''
                    - value: 2x3
                      name: ''
                      description: ''
                    - value: 3x2
                      name: ''
                      description: ''
                    - value: 3x4
                      name: ''
                      description: ''
                    - value: 4x3
                      name: ''
                      description: ''
                    - value: 4x5
                      name: ''
                      description: ''
                    - value: 5x4
                      name: ''
                      description: ''
                    - value: 9x16
                      name: ''
                      description: ''
                    - value: 16x9
                      name: ''
                      description: ''
                    - value: 21x9
                      name: ''
                      description: ''
                  description: '格式{w}x{h} '
                  example: ''
              required:
                - model
                - prompt
                - image
            examples: {}
      responses:
        '200':
          description: ''
          content:
            application/json:
              schema:
                type: object
                properties:
                  created:
                    type: integer
                  data:
                    type: array
                    items:
                      type: object
                      properties:
                        url:
                          type: string
                      required:
                        - url
                      x-apifox-orders:
                        - url
                required:
                  - created
                  - data
                x-apifox-orders:
                  - created
                  - data
              example:
                created: 1589478378
                data:
                  - url: https://...
                  - url: https://...
          headers: {}
          x-apifox-name: 成功
      security:
        - bearer: []
      x-apifox-folder: 图片生成/nano-banana/image/generations 格式(dalle 格式)
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7040782/apis/api-343646957-run
components:
  schemas: {}
  securitySchemes:
    bearer:
      type: http
      scheme: bearer
servers:
  - url: https://api.tu-zi.com
    description: api.tu-zi.com
security:
  - bearer: []

```

2.1 生成图像 （chat 必须流式请求）示例1 简单版本
"""
Gemini API 图像处理工具 v1.3
================================
功能描述：
- 支持向 Gemini AI 模型发送单张或多张图片进行分析和生成
- 自动处理API返回的混合内容（文字、base64图片、URL图片）
- 智能重试机制处理API配额超限和超时错误
- 使用流式响应确保大型图片数据的完整接收
- 将所有输出内容整理保存到带时间戳的目录中

作者：兔子CC
更新日期：2025-08-28
"""

import os
import base64
import re
import requests
import time
import json
from datetime import datetime
from openai import OpenAI

# ====================================
# 用户配置变量 - 请根据需要修改以下设置
# ====================================

# API配置
API_KEY = "sk-**"  # 请替换为你的实际API密钥
BASE_URL = "https://api.tu-zi.com/v1"  # 请替换为你的实际基础URL
MODEL_NAME = "gemini-3-pro-image-preview"  # 使用的模型名称

# 图片路径（可以是单个路径或路径列表）
IMAGE_PATHS = [
    r"C:\Users\20wj2\Downloads\下载2.png",  # 第一张图片
    r"C:\Users\20wj2\Downloads\sz.png",  # 可以添加更多图片
    # r"C:\Users\20wj2\Downloads\image3.png",
]
# 为了向后兼容，如果只有一张图片也可以直接使用字符串
# IMAGE_PATHS = r"C:\Users\20wj2\Downloads\下载2.png"

# 提示词设置
PROMPT_TEXT = "依据上传图片，生成新的图片。图片1中的女士抱着图片2中人物形象的公仔，在睡觉。"  # 自定义提示词

# 重试设置
MAX_RETRIES = 10  # 最大重试次数
RETRY_DELAY = 0  # 重试延迟时间（秒），0表示立即重试

# API调用超时设置
API_TIMEOUT = 120  # API调用超时时间（秒），建议120秒以等待图片生成
USE_STREAM = True  # 必须使用流式响应才能获取完整的图片数据！

# ====================================
# 以下为功能代码，一般情况下无需修改
# ====================================

def prepare_image_data(image_path):
    """准备图片数据，转换为base64格式"""
    try:
        with open(image_path, "rb") as img_file:
            encoded_data = base64.b64encode(img_file.read()).decode("utf-8")
            return "data:image/png;base64," + encoded_data
    except Exception as e:
        print(f"准备图片数据时出错: {image_path} - {e}")
        raise

def create_output_directory():
    """创建输出目录"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_dir = f"output_{timestamp}"
    os.makedirs(output_dir, exist_ok=True)
    return output_dir

def save_base64_image(base64_data, output_dir, image_index):
    """保存base64图片到本地"""
    try:
        # 移除data:image/png;base64,前缀（如果存在）
        if base64_data.startswith('data:image/'):
            base64_data = base64_data.split(',', 1)[1]
        
        # 解码base64数据
        image_data = base64.b64decode(base64_data)
        
        # 保存图片
        image_filename = f"image_{image_index}.png"
        image_path = os.path.join(output_dir, image_filename)
        
        with open(image_path, "wb") as img_file:
            img_file.write(image_data)
        
        print(f"已保存base64图片: {image_path}")
        return image_path
    except Exception as e:
        print(f"保存base64图片时出错: {e}")
        return None

def download_image_from_url(url, output_dir, image_index):
    """从URL下载图片到本地"""
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        # 获取文件扩展名
        content_type = response.headers.get('content-type', '')
        if 'png' in content_type.lower():
            ext = 'png'
        elif 'jpg' in content_type.lower() or 'jpeg' in content_type.lower():
            ext = 'jpg'
        elif 'gif' in content_type.lower():
            ext = 'gif'
        else:
            ext = 'png'  # 默认扩展名
        
        # 保存图片
        image_filename = f"image_url_{image_index}.{ext}"
        image_path = os.path.join(output_dir, image_filename)
        
        with open(image_path, "wb") as img_file:
            for chunk in response.iter_content(chunk_size=8192):
                img_file.write(chunk)
        
        print(f"已下载URL图片: {image_path}")
        return image_path
    except Exception as e:
        print(f"下载URL图片时出错: {e}")
        return None

def save_mixed_content(content, output_dir):
    """保存混合内容（文字、base64图片、URL图片）"""
    try:
        # 查找base64图片
        base64_pattern = r'data:image/[^;]+;base64,([A-Za-z0-9+/=]+)'
        base64_matches = re.finditer(base64_pattern, content)
        
        # 查找URL链接
        url_pattern = r'https?://[^\s<>"]+\.(png|jpg|jpeg|gif)'
        url_matches = re.finditer(url_pattern, content, re.IGNORECASE)
        
        # 保存文字内容到文件
        text_content = content
        image_index = 1
        
        # 处理base64图片
        for match in base64_matches:
            full_match = match.group(0)
            base64_data = match.group(1)
            
            # 保存base64图片
            saved_path = save_base64_image(base64_data, output_dir, image_index)
            if saved_path:
                # 在文本中替换base64数据为文件路径
                text_content = text_content.replace(full_match, f"[保存的图片: {saved_path}]")
                image_index += 1
        
        # 处理URL图片
        for match in url_matches:
            url = match.group(0)
            
            # 下载URL图片
            saved_path = download_image_from_url(url, output_dir, image_index)
            if saved_path:
                # 在文本中替换URL为文件路径
                text_content = text_content.replace(url, f"[下载的图片: {saved_path}]")
                image_index += 1
        
        # 保存处理后的文字内容
        text_filename = os.path.join(output_dir, "content.txt")
        with open(text_filename, "w", encoding="utf-8") as text_file:
            text_file.write(text_content)
        
        print(f"已保存文字内容: {text_filename}")
        
        # 同时保存原始内容
        original_filename = os.path.join(output_dir, "original_content.txt")
        with open(original_filename, "w", encoding="utf-8") as original_file:
            original_file.write(content)
        
        print(f"已保存原始内容: {original_filename}")
        
    except Exception as e:
        print(f"保存混合内容时出错: {e}")

def is_quota_exceeded_error(error_message):
    """检查是否为配额超出错误"""
    quota_keywords = [
        "exceeded your current quota",
        "quota exceeded",
        "billing details",
        "plan and billing"
    ]
    error_str = str(error_message).lower()
    return any(keyword in error_str for keyword in quota_keywords)

def call_api_raw(api_key, base_url, model, messages, timeout=API_TIMEOUT, use_stream=False, output_dir=None):
    """使用原始HTTP请求调用API，获取完整响应"""
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": model,
        "messages": messages,
        "stream": use_stream
    }
    
    url = f"{base_url}/chat/completions"
    
    try:
        print(f"发送原始HTTP请求到: {url}")
        if use_stream:
            print("使用流式响应模式...")
        
        response = requests.post(url, headers=headers, json=data, timeout=timeout, stream=use_stream)
        response.raise_for_status()
        
        if use_stream:
            # 处理流式响应
            full_content = ""
            all_chunks = []
            
            for line in response.iter_lines():
                if line:
                    line_str = line.decode('utf-8')
                    if line_str.startswith('data: '):
                        data_str = line_str[6:]
                        if data_str != '[DONE]':
                            try:
                                chunk = json.loads(data_str)
                                all_chunks.append(chunk)
                                if 'choices' in chunk and len(chunk['choices']) > 0:
                                    delta = chunk['choices'][0].get('delta', {})
                                    if 'content' in delta:
                                        full_content += delta['content']
                            except json.JSONDecodeError:
                                pass
            
            # 保存所有流式数据（调试用）
            if output_dir:
                debug_path = os.path.join(output_dir, "stream_chunks.json")
                with open(debug_path, "w", encoding="utf-8") as f:
                    json.dump(all_chunks, f, ensure_ascii=False, indent=2)
            
            print(f"流式响应: 接收到 {len(all_chunks)} 个数据块")
            if len(full_content) > 1000:
                print(f"获取到完整数据: {len(full_content)} 字符（包含图片）")
            else:
                print(f"获取到文本内容: {len(full_content)} 字符")
            
            # 构造标准响应格式
            json_response = {
                "choices": [{
                    "message": {
                        "role": "assistant",
                        "content": full_content
                    }
                }],
                "stream_chunks": all_chunks
            }
        else:
            # 获取完整的JSON响应
            json_response = response.json()
        
        # 保存原始JSON响应用于调试
        if output_dir:
            debug_path = os.path.join(output_dir, "raw_api_response.json")
            with open(debug_path, "w", encoding="utf-8") as f:
                json.dump(json_response, f, ensure_ascii=False, indent=2)
            print(f"原始API响应已保存到: {debug_path}")
        
        return json_response
    except requests.exceptions.RequestException as e:
        print(f"HTTP请求失败: {e}")
        raise

def call_openai_with_retry(client, model, messages, max_retries=MAX_RETRIES, retry_delay=RETRY_DELAY, timeout=API_TIMEOUT):
    """带重试功能的OpenAI API调用"""
    for attempt in range(max_retries):
        try:
            print(f"第 {attempt + 1} 次尝试调用API...")
            if timeout > 60:
                print(f"设置超时时间: {timeout}秒 (等待图片生成)")
            
            completion = client.chat.completions.create(
                model=model,
                messages=messages,
                timeout=timeout
            )
            
            print("API调用成功！")
            return completion
            
        except Exception as e:
            error_message = str(e)
            print(f"API调用失败: {error_message}")
            
            # 检查是否为配额超出错误或超时错误
            if is_quota_exceeded_error(error_message):
                if attempt  0:
                        print(f"检测到配额超出错误，将在 {retry_delay} 秒后进行第 {attempt + 2} 次重试...")
                        time.sleep(retry_delay)
                    else:
                        print(f"检测到配额超出错误，立即进行第 {attempt + 2} 次重试...")
                    continue
                else:
                    print("已达到最大重试次数，仍然配额超出，请检查账户余额和计费设置。")
                    raise
            elif "timeout" in error_message.lower() or "timed out" in error_message.lower():
                if attempt  500 else response_content)

# 保存混合内容到本地
save_mixed_content(response_content, output_directory)
print(f"\n所有内容已保存到目录: {output_directory}")2.2 文本生图 - generate端点（default分组、gemini-mix分组）示例1 简单版本from openai import OpenAI
import base64
import requests
import os

# 获取环境变量，如果未设置则使用默认值
api_key = os.environ.get("TUZI_API_KEY", "sk-***")
api_base = os.environ.get("TUZI_API_BASE", "https://api.tu-zi.com/v1")

client = OpenAI(
    base_url=api_base,
    api_key=api_key
)

result = client.images.generate(
    model="gemini-3-pro-image-preview",
    prompt="生成一副清明上河图"
)

print(result)
print(result.data)

image_base64 = result.data[0].b64_json
image_url = result.data[0].url

if image_base64:
    image_bytes = base64.b64decode(image_base64)
    with open("blackhole1.png", "wb") as f:
        f.write(image_bytes)
    print("图片已通过base64保存为 blackhole.png")
elif image_url:
    response = requests.get(image_url)
    response.raise_for_status()
    with open("blackhole.png", "wb") as f:
        f.write(response.content)
    print(f"图片已通过url下载并保存为 blackhole.png，url: {image_url}")
else:
    raise ValueError("API 没有返回图片的 base64 数据或图片链接！")2.3 修改现有图像 - edit端点（default分组）示例1 简单版本from openai import OpenAI
import base64
import requests
import os

# 从环境变量获取API密钥和基础URL
# 可以通过以下方式设置环境变量:
# Windows (CMD):
#   set TUZI_API_KEY=sk-your-api-key
#   set TUZI_API_BASE=https://api.tu-zi.com/v1
# Windows (PowerShell):
#   $env:TUZI_API_KEY="sk-your-api-key"
#   $env:TUZI_API_BASE="https://api.tu-zi.com/v1"
# Linux/macOS:
#   export TUZI_API_KEY=sk-your-api-key
#   export TUZI_API_BASE=https://api.tu-zi.com/v1

# 获取环境变量，如果未设置则使用默认值
api_key = os.environ.get("TUZI_API_KEY", "sk-***")
api_base = os.environ.get("TUZI_API_BASE", "https://api.tu-zi.com/v1")

client = OpenAI(
    base_url=api_base,
    api_key=api_key
)

result = client.images.edit(
    model="gemini-3-pro-image-preview",
    image=open("C:/Users/north/Pictures/Saved Pictures/tuzisleep.jpg", "rb"),
    # mask=open("C:/Users/north/Pictures/Saved Pictures/bff77acc-daee-4c96-b86c-1ba8049ec788.jpg", "rb"),
    prompt="将图二的人物以近景的的形式输出图片",
    response_format="url"  # 返回格式 例如  b64_json
)

print(result)
print(result.data)

image_base64 = result.data[0].b64_json
image_url = result.data[0].url

if image_base64:
    image_bytes = base64.b64decode(image_base64)
    with open("gift-basket.png", "wb") as f:
        f.write(image_bytes)
    print("图片已通过base64保存为 gift-basket.png")
elif image_url:
    response = requests.get(image_url)
    response.raise_for_status()
    with open("gift-basket.png", "wb") as f:
        f.write(response.content)
    print(f"图片已通过url下载并保存为 gift-basket.png，url: {image_url}")
else:
    raise ValueError("API 没有返回图片的 base64 数据或图片链接！")