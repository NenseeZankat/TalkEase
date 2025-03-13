from llama_cpp import Llama

# Load the GGUF model
model_path = ".\saved_model\llama-2-7b-chat.Q4_K_M.gguf"  # Update path if needed
print(f"🔄 Loading model: {model_path}")

llm = Llama(model_path=model_path, n_ctx=2048, n_threads=8)  # Increased context for longer conversations
print("✅ Model loaded successfully!\n")

# Chat history to maintain context
chat_history = []

def chat_with_llama():
    print("📝 LLaMA 2 Chatbot (Type 'exit' to quit)")
    while True:
        user_input = input("\n👤 You: ")
        if user_input.lower() in ["exit", "quit"]:
            print("👋 Exiting chat. Have a great day!")
            break

        # Add user message to history
        chat_history.append(f"User: {user_input}\nAssistant:")

        # Format prompt with history
        prompt = "\n".join(chat_history)

        # Get LLaMA response
        output = llm(
            prompt,
            max_tokens=1500,  # Set a limit for responses
            stop=["User:", "Assistant:"],  # Prevent excessive looping
            temperature=0.7,
        )

        response = output["choices"][0]["text"].strip()
        
        # Display assistant response
        print(f"🤖 LLaMA: {response}")

        # Add response to history
        chat_history.append(f"{response}")

# Start chat
chat_with_llama()
