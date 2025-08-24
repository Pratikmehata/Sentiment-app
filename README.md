
# Sentiment Analysis Web App

This repository contains a Flask-based web application for **Sentiment Analysis**.  
The app allows users to input text and get predictions on whether the sentiment is **Positive, Negative, or Neutral**, using a pre-trained Machine Learning model.

---

## 📂 Project Structure

```

├── model/             # Contains trained sentiment analysis model files (e.g., .pkl)
├── static/            # CSS, JS, images for frontend
├── templates/         # HTML templates (Jinja2 for Flask)
├── app.py             # Main Flask application
├── requirements.txt   # Python dependencies
├── runtime.txt        # Runtime environment details
└── README.md          # Project documentation

````

---

## 🚀 Features
- Predict sentiment (Positive / Negative / Neutral) from user input text  
- Flask-based backend serving ML model  
- User-friendly web interface with HTML & CSS  
- Deployed on **Render** for free and easy hosting  

---

## ⚙️ Installation & Setup (Local)

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/sentiment-analysis-app.git
   cd sentiment-analysis-app
````

2. Create and activate a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate   # Linux/Mac
   venv\Scripts\activate      # Windows
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Run the app locally:

   ```bash
   python app.py
   ```

5. Open in browser:

   ```
   http://127.0.0.1:5000
   ```

---

## 🌐 Deployment on Render

1. Push your project to **GitHub** (make sure `requirements.txt` and `runtime.txt` are included).
2. Go to [Render](https://render.com/) and create a new **Web Service**.
3. Connect your GitHub repository.
4. Configure the service:

   * **Build Command:**

     ```
     pip install -r requirements.txt
     ```
   * **Start Command:**

     ```
     gunicorn app:app
     ```
5. Choose a free plan and deploy 🚀
6. Render will provide you with a live URL for your app.

---

## 📌 Requirements

All dependencies are listed in `requirements.txt`. Example:

```
flask
gunicorn
scikit-learn
pandas
numpy
nltk
```

---

## 🛠️ Runtime

The `runtime.txt` specifies the Python version. Example:

```
python-3.9.13
```

---


