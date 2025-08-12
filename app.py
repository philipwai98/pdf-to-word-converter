from flask import Flask, request, render_template, send_file
from pdf2docx import Converter
import os, uuid

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        file = request.files['pdf_file']
        if file:
            pdf_name = f"temp_{uuid.uuid4()}.pdf"
            docx_name = f"temp_{uuid.uuid4()}.docx"

            file.save(pdf_name)
            cv = Converter(pdf_name)
            cv.convert(docx_name, start=0, end=None)
            cv.close()

            return send_file(docx_name, as_attachment=True)

    return render_template('index.html')

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
