import requests

appointment_data = {
    "patient_id": "12345",
    "doctor_id": "67890",
    "date": "2022-01-01",
    "time": "10:00 AM"
}
ap_res = requests.post("http://192.168.28.168:5000/save_appointment", json=appointment_data)