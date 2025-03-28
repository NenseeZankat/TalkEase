import onnxruntime
import numpy as np
from transformers import AutoTokenizer

# Load the tokenizer
model_name = "kingabzpro/Llama-3.1-8B-Instruct-Mental-Health-Classification"
tokenizer = AutoTokenizer.from_pretrained(model_name)

# Check if the tokenizer has a padding token; if not, assign eos_token as pad_token
if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token  # Use EOS token as padding token

# Ensure that the ONNX model path is correct
onnx_model_path = "./saved_model/mental_health_model.onnx"
session = onnxruntime.InferenceSession(onnx_model_path)

# Function to get the top N predictions
def get_top_n_predictions(text, n=2):
    # Tokenize input text
    inputs = tokenizer(text, return_tensors="np", padding=True, truncation=True)
    
    # Get the input_ids and attention_mask
    input_ids = inputs['input_ids']
    attention_mask = inputs['attention_mask']
    
    # Ensure that input_ids and attention_mask are of type int64
    input_ids = input_ids.astype(np.int64)
    attention_mask = attention_mask.astype(np.int64)
    
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
    
    # Get the top N predictions
    top_n_idx = np.argsort(softmax_probs, axis=-1)[:, -n:][:, ::-1]
    top_n_probs = np.take_along_axis(softmax_probs, top_n_idx, axis=-1)
    
    # Print the top N results
    return top_n_idx, top_n_probs

# Test the model
text = "I am feeling very anxious today, and I need some support."
top_n_idx, top_n_probs = get_top_n_predictions(text)

# Print the top N results (You would need the labels corresponding to the indices)
print("Top 2 predictions (class indices and probabilities):")
for i, (idx, prob) in enumerate(zip(top_n_idx[0], top_n_probs[0])):
    print(f"{i+1}. Class Index: {idx}, Probability: {prob:.4f}")
