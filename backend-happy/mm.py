import google.generativeai as genai
import json

# Configure your Gemini API key
genai.configure(api_key="AIzaSyC_9O6jp--RJAxgVx-zz1N87BWrX0P_WzI")

def process_aadhaar_image(image_data):
    # Initialize the model (use a multimodal-capable model)
    model = genai.GenerativeModel("gemini-1.5-flash")

    # Define the prompt for extracting Aadhaar card details
    prompt = """You are an advanced AI specialist with expertise in extracting data from images using optical character recognition techniques. Your task is to analyze the provided Aadhaar card image and extract the necessary information, returning it in a specified JSON format.
    Return the extracted information in the following JSON structure: { "aadhaar_info": { "name": "string", // Full name of the cardholder "aadhaar_number": "string", // 12-digit Aadhaar number (masked or unmasked) "date_of_birth": "string", // Date of birth in DD-MM-YYYY format or as found "gender": "string", // Gender: "Male", "Female", or "Other" "address": "string or null" // Address if present, otherwise null }, "source": "image" }
    Ensure that the output is valid JSON. If a field is not found in the image, use null for that value. Do not omit any fields from the structure and make sure not to include any markdown in the response."""

    # Send the request to Gemini API
    response = model.generate_content([
        prompt,
        {"mime_type": "image/jpeg", "data": image_data}  # Adjust mime_type if using PNG, etc.
    ])

    # Get the raw response text
    raw_output = response.text

    # Clean the response
    try:
        print("Raw output from Gemini:")
        print(raw_output)
        print("---")

        # Clean the response
        # Remove ```json at the start and ``` at the end, then strip whitespace
        cleaned_output = raw_output
        if cleaned_output.startswith("```json"):
            cleaned_output = cleaned_output[7:]  # Remove ```json and anything before
        if "```" in cleaned_output:
            cleaned_output = cleaned_output.split("```")[0]  # Take content before closing ```
        cleaned_output = cleaned_output.strip()  # Remove leading/trailing whitespace or newlines

        # Debug: Print cleaned output
        print("Cleaned output:")
        print(cleaned_output)
        print("---")

        # Parse and return the JSON
        json_output = json.loads(cleaned_output)
        return json_output

    except json.JSONDecodeError as e:
        print(f"JSON parsing error: {str(e)}")
        print("Cleaned output causing the error:", cleaned_output)
        return {'error': 'JSON parsing error', 'details': str(e)}
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return {'error': 'An error occurred', 'details': str(e)}

    finally:
        print("Script completed.")

def process_prescription_image(image_data):
    # Initialize the model (use a multimodal-capable model)
    model = genai.GenerativeModel("gemini-1.5-flash")



    # Define the prompt for extracting prescription details
    prompt = """You are an advanced AI specialist with expertise in extracting data from images using optical character recognition techniques. Your task is to analyze the provided prescription image and extract the necessary information, returning it in a specified JSON format.
    Return the extracted information in the following JSON structure: { "prescription_info": { "patient_name": "string", // Full name of the patient "doctor_name": "string", // Full name of the doctor "medications": [ // List of medications prescribed { "name": "string", // Name of the medication "dosage": "string", // Dosage information "frequency": "string" // Frequency of intake } ], "date_of_issue": "string", // Date of issue in DD-MM-YYYY format or as found "clinic_address": "string or null" // Clinic address if present, otherwise null }, "source": "image" }
    Ensure that the output is valid JSON. If a field is not found in the image, use null for that value. Do not omit any fields from the structure and make sure not to include any markdown in the response."""

    # Send the request to Gemini API
    response = model.generate_content([
        prompt,
        {"mime_type": "image/jpeg", "data": image_data}  # Adjust mime_type if using PNG, etc.
    ])

    # Get the raw response text
    raw_output = response.text

    # Clean the response
    try:
        print("Raw output from Gemini:")
        print(raw_output)
        print("---")

        # Clean the response
        # Remove ```json at the start and ``` at the end, then strip whitespace
        cleaned_output = raw_output
        if cleaned_output.startswith("```json"):
            cleaned_output = cleaned_output[7:]  # Remove ```json and anything before
        if "```" in cleaned_output:
            cleaned_output = cleaned_output.split("```")[0]
        cleaned_output = cleaned_output.strip()  # Remove leading/trailing whitespace or newlines

        # Debug: Print cleaned output
        print("Cleaned output:")
        print(cleaned_output)
        print("---")

        # Parse and return the JSON
        json_output = json.loads(cleaned_output)
        return json_output

    except json.JSONDecodeError as e:
        print(f"JSON parsing error: {str(e)}")
        print("Cleaned output causing the error:", cleaned_output)
        return {'error': 'JSON parsing error', 'details': str(e)}
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return {'error': 'An error occurred', 'details': str(e)}

    finally:
        print("Script completed.")
    




# Sample usage
# with open("aadhar.jpeg", "rb") as image_file:
#     image_data = image_file.read()
#     result = process_aadhaar_image(image_data)

# with open("prescription.png", "rb") as image_file:
#     image_data = image_file.read()
#     result = process_prescription_image(image_data)
#     print(result)
#     print("---")