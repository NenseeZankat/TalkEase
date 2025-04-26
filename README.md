# TalkEase

**TalkEase** is an AI-powered mental health chatbot designed to offer multilingual support, emotion-aware conversations, and intelligent analytics. Built using **LLaMA 2** with **GPTQ optimization**, it ensures efficient performance on both GPU and CPU environments—even in resource-constrained setups. 🚀

---

##  Architecture
![Image](https://github.com/user-attachments/assets/1c195e3b-99d3-4b15-9753-15ab2d0f8959)


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

## ScreenShots

![Image](https://github.com/user-attachments/assets/85635b04-c529-4806-8b7c-235815d4c3fa)

![Image](https://github.com/user-attachments/assets/7b6a20ed-ba87-417f-9ea6-c09d182300ca)

![Image](https://github.com/user-attachments/assets/ba6b0c30-9681-402d-b22f-1bc292b48246)

![Image](https://github.com/user-attachments/assets/19945dec-5cc6-408a-a454-089393fd8d33)

![Image](https://github.com/user-attachments/assets/2c19a480-ff77-4083-a9ba-30e82ab4817e)

![Image](https://github.com/user-attachments/assets/ed17b152-0065-4a17-bab5-7f1781cb5258)

![Image](https://github.com/user-attachments/assets/6a07d2bb-a301-4bcb-8e61-f1c2988a7c35)


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



