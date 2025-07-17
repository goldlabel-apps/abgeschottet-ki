# abgeschottet

> Ring-Fenced LLM on MacBook Air (M1, 8GB RAM)

This guide walks you through setting up a completely ring‑fenced Large Language Model (LLM) on your MacBook Air (M1) with 8GB RAM. We will use Ollama to run the lightweight Phi-3 Mini model locally. All prompts and responses will stay on your laptop.

## Prerequisites
- MacBook Air with Apple M1 chip
- macOS 15.5 or later
- At least **8 GB RAM** (Phi-3 Mini works in this configuration)
- At least **10 GB of free disk space**

---

## 1. Install Homebrew

If you don’t already have Homebrew installed, open **Terminal** and run:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

---

## 2. Install Ollama

```bash
brew install ollama
```

---

## 3. Start the Ollama service

```bash
ollama serve
```

Leave this terminal window open. Ollama will now be listening on `http://localhost:11434`.

---

## 4. Pull the Phi-3 Mini model

Open a **new Terminal window** and run:

```bash
ollama pull phi3
```

This downloads the quantized Phi-3 Mini weights (a few GB) into `~/.ollama/models`.

---

## 5. Run the model

```bash
ollama run phi3
```

You will see a prompt like:

```
>>>
```

Type in a question, for example:

```
Explain what machine learning weights are in simple terms.
```

Press **Enter** and wait for the response. Everything happens locally.

---

## 6. Test your ring‑fence

To confirm no data is leaving your machine, turn off Wi‑Fi and run again:

```bash
ollama run phi3
```

It still works — proving your model is fully ring‑fenced.

---

## Notes
- Running on 8 GB RAM will be slower than a GPU server, but it works for experimentation.
- Model files are stored in `~/.ollama/models`.
- Ollama provides a local API on `http://localhost:11434` for integration into apps.

---

## Next Steps
- Integrate with a custom app via HTTP POST.
- Explore retrieval‑augmented generation (RAG) by adding your own documents.
- Try other small models like `mistral` if you upgrade to a machine with more RAM.

Enjoy your private dojo for LLMs!
