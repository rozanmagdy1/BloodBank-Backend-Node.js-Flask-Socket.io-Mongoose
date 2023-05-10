# from flask import Flask, request, jsonify
import pickle
import numpy as np


from flask import Flask, request, jsonify

app = Flask(__name__)
model = pickle.load(open('logreg.pkl', 'rb'))


@app.route('/')
def hello_world():
    return 'Welcome to the home page!'


@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    data1 = data['Months_since_First_Donation']
    data2 = data['Months_since_Last_Donation']
    data3 = data['Number_of_Donations']
    data4 = data['Total_Volume_Donated_(c.c.)']
    arr = np.array([[data1, data2, data3, data4]])
    pred = model.predict(arr)[0]
    response = {'prediction': str(pred)}
    return jsonify(response)


if __name__ == '__main__':
    app.run()
