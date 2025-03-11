#!/bin/bash
# Repository Clone Script for AA_02 Project

# Navigate to the project directory - adjust path as necessary
cd ~/programming/aa_02

# Create repositories directory if it doesn't exist
mkdir -p repositories
cd repositories

# Clone browser-related repositories
echo "Cloning browser-use repository..."
git clone https://github.com/GoogleChromeLabs/browser-extension-starter browser-use

echo "Cloning web-ui repository..."
git clone https://github.com/shadcn-ui/ui web-ui

# Clone research repositories
echo "Cloning gpt-researcher repository..."
git clone https://github.com/assafelovic/gpt-researcher gpt-researcher

echo "Cloning gptr.dev repository..."
git clone https://github.com/0xpayne/gpt-researcher-api gptr.dev

# Clone model repositories
echo "Cloning deepseek-ai repository..."
git clone https://github.com/deepseek-ai/DeepSeek-Coder deepseek-ai

echo "Cloning Qwen repository..."
git clone https://github.com/QwenLM/Qwen Qwen

echo "Cloning Wan2.1 repository..."
git clone https://github.com/wanlab-io/Wan2.1 Wan2.1

echo "All repositories have been cloned successfully."

# Return to the project root directory
cd ..

echo "Repository cloning complete. Please update repository URLs in this script with the correct GitHub URLs before using."
