from flask import Flask, request, jsonify
from openai import OpenAI

app = Flask(__name__)

# Initialize the OpenAI client
client = OpenAI(base_url="http://localhost:1234/v1", api_key="happy")
model = "hermes-3-llama-3.2-3b"

# Temporary storage for user responses
user_data = {}

# Define the first-stage generic questionnaire
generic_questionnaire = [
    {"id": 1, "category": "Detailed History", "question": "What brings you in today? (Chief Complaint)"},
    {"id": 2, "category": "Detailed History", "question": "How long have you been experiencing these symptoms?"},
    {"id": 3, "category": "Medical History", "question": "Do you have any chronic conditions (e.g., diabetes, hypertension)?"},
    {"id": 4, "category": "Medical History", "question": "Have you had any major surgeries or procedures in the past?"},
    {"id": 5, "category": "Medical History", "question": "Do you have any known allergies (medications, food, environmental)?"},
    {"id": 6, "category": "Medical History", "question": "Is there a history of any major diseases in your family?"},
    {"id": 7, "category": "Current Medication", "question": "Are you currently taking any prescribed medications?"},
    {"id": 8, "category": "Current Medication", "question": "Are you taking any over-the-counter drugs or supplements?"},
    {"id": 9, "category": "Test Results", "question": "Have you had any recent lab tests or imaging done?"},
    {"id": 10, "category": "Lifestyle & Risk Factors", "question": "How would you describe your diet and nutrition habits?"},
    {"id": 11, "category": "Lifestyle & Risk Factors", "question": "Do you smoke, drink alcohol, or use any substances?"},
    {"id": 12, "category": "Lifestyle & Risk Factors", "question": "How frequently do you exercise?"},
    {"id": 13, "category": "Lifestyle & Risk Factors", "question": "How has your mental health been recently?"}
]

@app.route('/questionnaire', methods=['GET'])
def get_questionnaire():
    """Returns the first-stage generic questionnaire."""
    return jsonify({"questions": generic_questionnaire})

@app.route('/submit_responses', methods=['POST'])
def submit_responses():
    """Sends responses to LLM to determine the next set of questions and stores initial responses."""
    data = request.json
    user_id = data.get("user_id")
    user_responses = data.get("responses")
    
    if not user_id or not user_responses:
        return jsonify({"error": "Missing user_id or responses"}), 400
    
    user_data[user_id] = {"first_stage_responses": user_responses}
    
    prompt = f"""
    Based on the following patient responses, determine the next set of questions needed to complete their medical profile:
    {user_responses}
    
    Provide the next questions in a structured JSON format like:
    [
        {"category": "Category Name", "question": "New question here"},
        ...
    ]
    """
    
    try:
        completion = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}]
        )
        next_questions = completion.choices[0].message.content
        
        return jsonify({"next_questions": next_questions})
    except Exception as e:
        return jsonify({"error": f"Error generating next questions: {str(e)}"}), 500

@app.route('/submit_second_responses', methods=['POST'])
def submit_second_responses():
    """Collects second-stage responses and generates the final detailed medical report."""
    data = request.json
    user_id = data.get("user_id")
    second_responses = data.get("responses")
    
    if not user_id or not second_responses:
        return jsonify({"error": "Missing user_id or second responses"}), 400
    
    if user_id not in user_data:
        return jsonify({"error": "User data not found"}), 404
    
    user_data[user_id]["second_stage_responses"] = second_responses
    
    prompt = f"""
    Generate a comprehensive medical report based on the following user responses:
    
    First-stage responses:
    {user_data[user_id]["first_stage_responses"]}
    
    Second-stage responses:
    {second_responses}
    
    Provide a structured and detailed report summarizing the patient's medical history, current condition, lifestyle risks, and potential concerns.
    """
    
    try:
        completion = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}]
        )
        final_report = completion.choices[0].message.content
        
        return jsonify({"final_report": final_report})
    except Exception as e:
        return jsonify({"error": f"Error generating medical report: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
