from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from connect import Connect  # Import the Connect class

app = Flask(__name__)
CORS(app) 

# Initialize the Connect class
db_connection = Connect()

#DONE
@app.route('/get_detailed_report/<patient_id>', methods=['GET'])
def get_detailed_report(patient_id):
    """
    Endpoint to fetch detailed report of a patient.
    
    :param patient_id: ID of the patient whose detailed report is to be fetched.
    
    :return: Detailed report with patient_id, and date as JSON response.
    """
    try:
        # Fetch the detailed report of the patient using the Connect class
        report = db_connection.get_detailed_report(patient_id)
        if not report:
            return jsonify({"error": "No detailed report found"}), 404

        # Convert ObjectId and other non-serializable fields to strings
        report["_id"] = str(report["_id"])
        report["patient_name"] = report.get("patient_name", "")
        report["date_of_birth"] = report.get("date_of_birth", "")
        report["gender"] = report.get("gender", "")
        report["blood_group"] = report.get("blood_group", "")
        report["contact_info"] = report.get("contact_info", "")
        report["summary"] = report.get("summary", "")
        report["detailed_history"] = report.get("detailed_history", {})
        report["medical_history"] = report.get("medical_history", {})
        report["medical_condition"] = report.get("medical_condition", {})
        report["current_medication"] = report.get("current_medication", {})
        report["test_results"] = report.get("test_results", {})
        report["lifestyle_risk_factors"] = report.get("lifestyle_risk_factors", {})
        return jsonify(report), 200
    except Exception as e:
        print(e)
        return jsonify({"error": f"Failed to fetch detailed report: {str(e)}"}), 500


@app.route('/save_detailed_report', methods=['POST'])
def save_detailed_report():
    """
    Endpoint to save detailed report of a patient.
    Accepts JSON data in the request body.
    """
    try:
        data = request.json  # Parse JSON data from the request
        if not data:
            return jsonify({"error": "Invalid or missing JSON data"}), 400

        # Save detailed report using the Connect class
        if db_connection.save_detailed_report(**data):
            return jsonify({"message": "Detailed report saved successfully!"}), 201
        else:
            return jsonify({"error": "Failed to save detailed report"}), 500
    except Exception as e:
        return jsonify({"error": f"Failed to save detailed report: {str(e)}"}), 500

#DONE
@app.route('/get_reports/<patient_id>', methods=['GET'])
def get_reports(patient_id, n=0):
    """
    Endpoint to fetch all reports of a patient.
    :param patient_id: ID of the patient whose reports are to be fetched.
    :param n: Number of reports to fetch. Default is 0, which fetches all reports.
    
    :return: List of report id with patient_id, and date as JSON response.
    """
    try:
        if n == 0:
            # Fetch all reports of the patient using the Connect class
            reports = db_connection.get_n_reports(patient_id)
        else:
            reports = db_connection.get_n_reports(patient_id,n)
        if not reports:
            return jsonify({"error": "No reports found"}), 404
        # Convert ObjectId and other non-serializable fields to strings
        main_reports = list()
        for report in reports:
            _report = dict()
            _report["_id"] = str(report["_id"])
            _report["patient_id"] = str(report["patient_id"])
            _report["doctor_id"] = str(report["doctor_id"])
            _report["date"] = str(report["date"])
            _report["doctor_name"] = report["doctor_name"]
            _report["conclusion"] = report["conclusion"]
            _report["tests_id"] = report.get("tests_id", [])  # List of test IDs
            _report["prescriptions_id"] = report.get("prescriptions_id", [])  # List of prescription IDs
            _report["report_file"] = "Stored in GridFS"  # Assuming the file is in GridFS
            main_reports.append(_report)

        return jsonify(main_reports), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch reports: {str(e)}"}), 500
  
#DONE
@app.route('/get_patient_details/<patient_id>', methods=['GET'])
def get_patient_details(patient_id):
    """
    Endpoint to fetch patient details by ID.
    """
    try:
        # Fetch the patient using the Connect class
        patient = db_connection.get_patient_details(patient_id)
        if not patient:
            return jsonify({"error": "Patient not found"}), 404

        # Convert ObjectId and other non-serializable fields to strings
        patient["_id"] = str(patient["_id"])
        return jsonify(patient), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch patient: {str(e)}"}), 500
    
@app.route('/save_patient', methods=['POST'])
def save_patient():
    """
    Endpoint to save patient details.
    Accepts JSON data in the request body.
    """
    try:
        data = request.json  # Parse JSON data from the request
        if not data:
            return jsonify({"error": "Invalid or missing JSON data"}), 400

        # Save patient details using the Connect class
        if db_connection.save_patient_details(**data):
            return jsonify({"message": "Patient saved successfully!"}), 201
        else:
            return jsonify({"error": "Failed to save patient"}), 500
    except Exception as e:
        return jsonify({"error": f"Failed to save patient: {str(e)}"}), 500
    
@app.route('/save_appointment', methods=['POST'])
def save_appointment():
    """
    Endpoint to save appointment details.
    Accepts JSON data in the request body.
    """
    try:
        data = request.json  # Parse JSON data from the request
        if not data:
            return jsonify({"error": "Invalid or missing JSON data"}), 400

        # Save appointment details using the Connect class
        if db_connection.save_appointment_details(**data):
            return jsonify({"message": "Appointment saved successfully!"}), 201
        else:
            return jsonify({"error": "Failed to save appointment"}), 500
    except Exception as e:
        return jsonify({"error": f"Failed to save appointment: {str(e)}"}), 500


#DONE
@app.route('/get_n_appointments/<doctor_id>', methods=['GET'])
def get_n_appointments(doctor_id):
    """
    Endpoint to fetch the latest N appointments of a doctor.
    """
    try:
        n = int(request.args.get('n', 5))  # Get the value of 'n' from query parameters
        if n < 1:
            return jsonify({"error": "Invalid value for 'n'. Please provide a positive integer"}), 400

        # Fetch the latest N appointments of the doctor using the Connect class
        appointments = db_connection.get_n_appointments(doctor_id)

        # appointments is a list of dictionaries
        if not appointments:
            return jsonify({"error": "No appointments found"}), 404
        else:
            # Convert ObjectId and other non-serializable fields to strings
            for appointment in appointments:
                appointment["_id"] = str(appointment["_id"])
                appointment["patient_id"] = str(appointment["patient_id"])
                appointment["date"] = str(appointment["date"])
                appointment["name"] = appointment.get("name", "")
                appointment["sex"] = appointment.get("sex", "")
                appointment["age"] = appointment.get("age", "")

        return jsonify(appointments), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch appointments: {str(e)}"}), 500


#DONE
@app.route('/get_appointment/<appointment_id>', methods=['GET'])
def get_appointment(appointment_id):
    """
    Endpoint to fetch appointment details by ID.
    """
    try:
        # Fetch the appointment using the Connect class
        appointment = db_connection.get_appointment_details(_id=appointment_id)
        if not appointment:
            return jsonify({"error": "Appointment not found"}), 404

        # Convert ObjectId and other non-serializable fields to strings
        appointment["_id"] = str(appointment["_id"])
        return jsonify(appointment), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch appointment: {str(e)}"}), 500

if __name__ == '__main__':
    # Run the Flask app and make it accessible on the network
    app.run(host='0.0.0.0', port=5000, debug=True)
