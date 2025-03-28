import onnxruntime
import numpy as np
from transformers import AutoTokenizer

# Load the tokenizer
model_name = "kingabzpro/Llama-3.1-8B-Instruct-Mental-Health-Classification"
tokenizer = AutoTokenizer.from_pretrained(model_name)

# Ensure that the ONNX model path is correct
onnx_model_path = "./saved_model/mental_health_model.onnx"
session = onnxruntime.InferenceSession(onnx_model_path)

# Function to get the prediction
def get_prediction(text):
    # Tokenize input text with padding and truncation (increase max_length to 512)
    inputs = tokenizer(text, return_tensors="np", padding=True, truncation=True, max_length=512)
    
    # Get input_ids and attention_mask
    input_ids = inputs['input_ids']
    attention_mask = inputs['attention_mask']
    
    # Ensure input_ids and attention_mask are of type int64
    input_ids = input_ids.astype(np.int64)
    attention_mask = attention_mask.astype(np.int64)
    
    # Check the dimensions of input_ids and attention_mask
    print(f"Input IDs shape: {input_ids.shape}")
    print(f"Attention mask shape: {attention_mask.shape}")
    
    # Prepare the ONNX input dictionary
    ort_inputs = {
        session.get_inputs()[0].name: input_ids,  # input_ids
        session.get_inputs()[1].name: attention_mask  # attention_mask
    }
    
    # Run the model in ONNX Runtime
    ort_outs = session.run(None, ort_inputs)
    
    # Get the logits (output before applying softmax)
    logits = ort_outs[0]
    
    # Apply softmax to get probabilities
    softmax_probs = np.exp(logits) / np.sum(np.exp(logits), axis=-1, keepdims=True)
    
    # Get the index of the highest probability
    top_idx = np.argmax(softmax_probs, axis=-1)
    top_prob = softmax_probs[0, top_idx[0]]
    
    # Return the predicted class and its probability
    return top_idx[0], top_prob

# Test the model
text = "I'm trapped in a storm of emotions that I can't control, and it feels like no one understands the chaos inside me"
predicted_class, probability = get_prediction(text)

# Print the prediction
print(f"Predicted class: {predicted_class}, Probability: {probability:.4f}")
