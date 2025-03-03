import os
import uuid
import subprocess
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
OUTPUT_DIR = os.path.join(BASE_DIR, "outputs")

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

@app.post("/render/")
async def render_blend(file: UploadFile = File(...)):
    """
    Receives a .blend file, renders it, and returns the output image.
    """
    
    file_ext = file.filename.split(".")[-1]
    if file_ext != "blend":
        return {"error": "Only .blend files are supported"}

    file_id = str(uuid.uuid4())
    blend_path = os.path.join(UPLOAD_DIR, f"{file_id}.blend")
    output_base = os.path.join(OUTPUT_DIR, f"{file_id}_output")
    expected_output_path = f"{output_base}0001.png"

    with open(blend_path, "wb") as f:
        f.write(await file.read())

    render_command = [
        "blender", "-b", blend_path,  # Run in background
        "--python-expr", 
        "import bpy; bpy.context.scene.render.engine = 'CYCLES'; "
        "bpy.context.preferences.addons['cycles'].preferences.compute_device_type = 'CUDA'; "
        "for device in bpy.context.preferences.addons['cycles'].preferences.get_devices(): "
        "device.use = True",  # Enable all CUDA devices
        "-o", output_base,  # Output path (without extension)
        "-F", "PNG", "-x", "1",  # PNG format with auto extension
        "-f", "1"  # Render frame 1
    ]

    process = subprocess.run(render_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    if process.returncode != 0:
        return {"error": "Blender rendering failed", "details": process.stderr.decode()}

    return FileResponse(expected_output_path, media_type="image/png")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
