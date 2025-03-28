import os
import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer
from onnxruntime.quantization import quantize_dynamic, QuantType

# Define model paths
model_name = "./mental_health_model"
onnx_model_dir = "./mental_health_onnx_model"
onnx_model_path = os.path.join(onnx_model_dir, "mental_health_model.onnx")
quantized_model_path = os.path.join(onnx_model_dir, "mental_health_model_quantized.onnx")

# Create directory if it doesn't exist
os.makedirs(onnx_model_dir, exist_ok=True)

# Load model and tokenizer
model = AutoModelForSequenceClassification.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)

# Set model to evaluation mode
model.eval()

# Create dummy input tensor
dummy_input_ids = torch.randint(0, 100, (1, 10))  # Random token IDs (batch=1, sequence length=10)
dummy_attention_mask = torch.ones_like(dummy_input_ids)  # Attention mask (all ones)

# Convert to ONNX
torch.onnx.export(
    model,
    (dummy_input_ids, dummy_attention_mask),
    onnx_model_path,
    input_names=["input_ids", "attention_mask"],
    output_names=["logits"],
    dynamic_axes={"input_ids": {0: "batch_size"}, "attention_mask": {0: "batch_size"}, "logits": {0: "batch_size"}},
    opset_version=14,  # Ensure ONNX supports transformers' latest features
)

print(f"Model successfully saved as ONNX: {onnx_model_path}")

# Perform ONNX model quantization
quantize_dynamic(
    onnx_model_path,
    quantized_model_path,
    weight_type=QuantType.QInt8  # Convert to 8-bit
)

print(f"Quantized model saved to {quantized_model_path}")
