import streamlit as st
import requests

BASE_URL = "http://localhost:9000"  # update if needed

st.header("Aadhaar Upload and Questionnaire Test")

# Initialize session state variables
if "patient_id" not in st.session_state:
    st.session_state.patient_id = None
if "stage" not in st.session_state:
    st.session_state.stage = "upload"
if "first_questions" not in st.session_state:
    st.session_state.first_questions = []
if "second_questions" not in st.session_state:
    st.session_state.second_questions = []
if "final_response" not in st.session_state:
    st.session_state.final_response = None

# Step 1: Upload Aadhaar image
if st.session_state.stage == "upload":
    st.subheader("Upload Aadhaar")
    uploaded_file = st.file_uploader("Choose Aadhaar image", type=["jpg", "jpeg", "png"])
    is_new_patient = st.checkbox("New Patient", value=True)
    if st.button("Upload Aadhaar") and uploaded_file is not None:
        files = {"image": uploaded_file.getvalue()}
        data = {"is_new_patient": str(is_new_patient)}
        response = requests.post(f"{BASE_URL}/upload_aadhaar", files=files, data=data)
        if response.status_code == 200:
            result = response.json()
            st.session_state.patient_id = result.get("patient_id")
            st.success(f"Aadhaar uploaded. Patient ID: {st.session_state.patient_id}")
            st.write("Aadhaar Details:", result.get("aadhaar_info"))
            st.session_state.stage = "first_questionnaire"
        else:
            st.error("Error uploading Aadhaar: " + response.text)

# Step 2: Answer first questionnaire
if st.session_state.stage == "first_questionnaire" and st.session_state.patient_id:
    st.subheader("First Questionnaire")
    if st.button("Get Questionnaire"):
        response = requests.get(f"{BASE_URL}/questionnaire")
        if response.status_code == 200:
            st.session_state.first_questions = response.json().get("questions", [])
        else:
            st.error("Error retrieving questionnaire: " + response.text)
    if st.session_state.first_questions:
        with st.form("first_form"):
            answers_first = {}
            for q in st.session_state.first_questions:
                answers_first[str(q["id"])] = st.text_input(f"{q['id']}. [{q['category']}] {q['question']}")
            submitted_first = st.form_submit_button("Submit First Responses")
            if submitted_first:
                payload = {"patient_id": st.session_state.patient_id, "responses": answers_first}
                response = requests.post(f"{BASE_URL}/submit_responses", json=payload)
                if response.status_code == 200:
                    st.success("First responses submitted.")
                    st.session_state.second_questions = response.json().get("next_questions", [])
                    st.session_state.stage = "second_questionnaire"
                else:
                    st.error("Error submitting responses: " + response.text)

# Step 3: Answer second questionnaire and show final result
if st.session_state.stage == "second_questionnaire" and st.session_state.second_questions:
    st.subheader("Second Questionnaire")
    with st.form("second_form"):
        answers_second = {}
        for i, q in enumerate(st.session_state.second_questions, start=1):
            answers_second[f"q{i}"] = st.text_input(f"{i}. [{q.get('category','')}] {q.get('question','')}")
        submitted_second = st.form_submit_button("Submit Second Responses")
        if submitted_second:
            payload = {"patient_id": st.session_state.patient_id, "responses": answers_second}
            response = requests.post(f"{BASE_URL}/submit_second_responses", json=payload)
            if response.status_code == 200:
                st.success("Final response received:")
                st.session_state.final_response = response.json()
                st.write(st.session_state.final_response)
                st.session_state.stage = "done"
            else:
                st.error("Error submitting second responses: " + response.text)
                
if st.session_state.stage == "done" and st.session_state.final_response:
    st.subheader("Final Report")
    st.json(st.session_state.final_response)