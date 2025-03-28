from transformers import AutoTokenizer, BertForSequenceClassification
import torch
import onnx

# Load the pre-trained model and tokenizer
tokenizer = AutoTokenizer.from_pretrained("monologg/bert-base-cased-goemotions-original")
model = BertForSequenceClassification.from_pretrained("monologg/bert-base-cased-goemotions-original", num_labels=28)

# Prepare an example input tensor (replace with appropriate input data if necessary)
# Example text input
input_text = "I am happy"

# Tokenize the input text
inputs = tokenizer(input_text, return_tensors="pt", padding=True, truncation=True, max_length=512)

# Export the model to ONNX format
onnx_path = "model.onnx"
torch.onnx.export(
    model,               # Model to export
    (inputs['input_ids'],),  # Pass the tokenized input tensor (as a tuple for compatibility)
    onnx_path,           # Path to save the ONNX model
    opset_version=14,    # Use opset version 14 or higher
    input_names=["input_ids"],  # Name of the input layer
    output_names=["output"],    # Name of the output layer
    dynamic_axes={
        "input_ids": {0: "batch_size", 1: "sequence_length"},  # Dynamic axes for input
        "output": {0: "batch_size"}  # Dynamic axes for output
    },
    do_constant_folding=True  # Optimize the model
)

# Verify the ONNX model
onnx_model = onnx.load(onnx_path)
onnx.checker.check_model(onnx_model)

print(f"Model successfully exported to {onnx_path}")
