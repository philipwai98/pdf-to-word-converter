from flask import Flask, render_template

app = Flask(__name__, static_folder='static', template_folder='templates')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/merge')
def merge():
    return render_template('merge.html')

@app.route('/split')
def split():
    return render_template('split.html')

@app.route('/compress')
def compress():
    return render_template('compress.html')

@app.route('/password')
def password():
    return render_template('password.html')

@app.route('/pdf2word')
def pdf2word():
    return render_template('pdf2word.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
