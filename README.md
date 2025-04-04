# TalkEase

**TalkEase** is an AI-powered mental health chatbot designed to offer multilingual support, emotion-aware conversations, and intelligent analytics. Built using **LLaMA 2** with **GPTQ optimization**, it ensures efficient performance on both GPU and CPU environments—even in resource-constrained setups. 🚀

---

## 🧠 What It Does

- Enables **multilingual interactions** for broader accessibility.
- Delivers **multimodal responses** – supports both **text** and **audio**.
- Supports **quantized LLaMA models** (reduced from 16GB to 4GB) for efficient **local inference**.
- Converts emotion classification models to **ONNX** format for optimal runtime performance.
- Features a powerful **chat analytics module**:
  - Classifies chat types (e.g., query, casual, concern).
  - Performs real-time **sentiment** and **emotion analysis**.

> 💡 **Challenge Tackled**: Not everyone has access to high-end GPUs. To address this, we utilize **compressed and quantized models** (GPTQ + ONNX), enabling smooth performance even on **CPU-only** machines.

---

## 🔧 Model Details

Explore the model implementation here:  
👉 [MindMitra - GitHub Repo](https://github.com/neha089/MindMitra)

---

## ✨ Features

- ✅ **Multilingual & Emotion-Aware Conversations**  
- ✅ **GPU (CUDA) and CPU Compatibility**  
- ✅ **Real-Time Streaming Responses** via **FastAPI**  
- ✅ Built using **TypeScript**, **Python**, and **JavaScript**  
- ✅ Supports **Quantized LLaMA Models** and **ONNX Runtime**

---

## 📦 Tech Stack
- Frontend: React.js, TypeScript 
- Backend: Node.js, Express.js 
- Model Server: FastAPI, Python 
- Model Inference: LLaMA 2 (GPTQ), ONNX Runtime 
- NLP Libraries: Transformers, ONNX, Torch 


## 🚀 Installation

```bash
git clone https://github.com/NenseeZankat/TalkEase.git
cd TalkEase
```
```bash
cd model
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```
```bash
cd client
npm run dev
```
```bash
cd server
npm start
```



