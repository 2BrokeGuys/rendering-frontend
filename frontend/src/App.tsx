import { ChangeEvent, FormEvent, useState } from "react";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
      setImageUrl("");
      setError("");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      setError("Please select a .blend file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://127.0.0.1:8000/render/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Rendering failed");
      }

      const blob = await response.blob();
      setImageUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-2xl text-center pt-2">
        v0 (Basic Single Server Rendering)
      </div>
      <div className="flex justify-center my-8">
        <form onSubmit={handleSubmit} className="flex items-center gap-4">
          <input type="file" accept=".blend" onChange={handleFileChange} />
          <button
            className="bg-blue-500 text-white border rounded-lg px-4 py-2"
            type="submit"
            disabled={loading}
          >
            {loading ? "Rendering..." : "Upload & Render"}
          </button>
        </form>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="flex flex-col items-center">
        <h1 className="text-2xl">Output</h1>
        {loading && <p>Rendering in progress...</p>}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Rendered Output"
            className="mt-4 border rounded-lg shadow-lg"
          />
        )}
      </div>
    </>
  );
}

export default App;
