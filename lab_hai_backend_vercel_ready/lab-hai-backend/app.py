from flask import Flask, request, jsonify
import random
app = Flask(__name__)
@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    return jsonify({ 'imageUrl': data.get('imageUrl'), 'analysis': { 'wrinkles': random.random(), 'redness': random.random(), 'pores': random.random(), 'pigmentation': random.random() } })
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
