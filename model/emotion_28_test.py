import onnx
import onnxruntime as ort
import numpy as np
from transformers import AutoTokenizer
from scipy.special import softmax  # Import softmax from scipy

# Load the tokenizer
tokenizer = AutoTokenizer.from_pretrained("monologg/bert-base-cased-goemotions-original")

# Load the ONNX model
onnx_model_path = "./saved_model/model.onnx"  # Path to the saved ONNX model
session = ort.InferenceSession(onnx_model_path)

# Prepare an example input text
input_text = "I am so sad , no one loves me "

# Tokenize the input text using the same tokenizer used during training
inputs = tokenizer(input_text, return_tensors="np", padding=True, truncation=True, max_length=512)

# Extract the input_ids as numpy array and convert to int64
input_ids = inputs['input_ids'].astype(np.int64)

# Prepare the inputs for the ONNX model (make sure to match the input names defined during export)
onnx_inputs = {
    "input_ids": input_ids
}

# Run inference using the ONNX model
onnx_output = session.run(None, onnx_inputs)

# The output is typically a list of predictions, we get the first output (since we only have one output in this case)
predictions = onnx_output[0]

# Process the output: predictions will typically be logits, apply softmax for probabilities
probabilities = softmax(predictions, axis=-1)

# Get the top 5 predicted classes and their probabilities
top_5_indices = np.argsort(probabilities[0])[-5:][::-1]
top_5_probabilities = probabilities[0][top_5_indices]

# Emotion labels (these are the emotion labels corresponding to the model's outputs)
emotion_labels = [
    "admiration", "amusement", "anger", "annoyance", "approval", "caring", "confusion", "curiosity", "desire", 
    "disappointment", "disapproval", "disgust", "embarrassment", "excitement", "fear", "gratitude", "grief", 
    "joy", "love", "nervousness", "optimism", "pride", "realization", "relief", "remorse", "sadness", "surprise", 
    "neutral"
]

# Print the top 5 predicted emotions and their probabilities
for i in range(5):
    emotion = emotion_labels[top_5_indices[i]]
    probability = top_5_probabilities[i]
    print(f"Emotion: {emotion}, Probability: {probability:.4f}")
