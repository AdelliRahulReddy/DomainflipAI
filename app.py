# app.py

from flask import Flask, jsonify, request
from flask_cors import CORS # Import CORS
import requests # For making HTTP requests to the Gemini API
import os # For environment variables
import json # For parsing JSON string from Gemini

# Initialize the Flask application
app = Flask(__name__)
# Enable CORS for all routes and origins.
# In a production environment, you might want to restrict this to specific origins
# For example: CORS(app, resources={r"/api/*": {"origins": "http://yourfrontenddomain.com"}})
CORS(app)

# --- Configuration for Gemini API ---
# It's highly recommended to load your API key from environment variables
# for security in a production environment.
# For local testing, you can temporarily place it here, but DO NOT commit it to version control.
GEMINI_API_KEY = "AIzaSyBm5BMlM8437QUZFB3kOcTPv2sqj7PUYtU" 
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

# Define a simple route for the root URL
@app.route('/')
def hello_world():
    """
    A basic endpoint that returns a greeting message.
    This can be used to test if the Flask application is running.
    """
    return jsonify({"message": "Hello from DomainFlipAI Backend!"})

def generate_gemini_domain_insights(keyword, domain_name):
    """
    Calls the Gemini API to generate comprehensive domain insights.
    Returns a dictionary of insights on success, or None on critical failure.
    """
    if not GEMINI_API_KEY or GEMINI_API_KEY == "YOUR_GEMINI_API_KEY_HERE":
        print("GEMINI_API_KEY is not set or is default. Skipping API call.")
        return None # Indicate a critical configuration error

    prompt = f"""
    For the domain name "{domain_name}" related to the keyword "{keyword}", provide the following details as a JSON object:
    1. "use_case": A concise, compelling use case for the domain (string).
    2. "flip_score": An integer (0-100) indicating its potential for profitable resale (number).
    3. "available": A boolean (true/false) indicating if the domain is likely available (boolean).
    4. "estimated_value": An estimated value range (string, e.g., "$1,000 - $2,000").
    5. "search_volume": A general search volume rating (string, e.g., "High", "Medium", "Low").
    6. "seo_difficulty": An SEO difficulty rating (string, e.g., "High", "Medium", "Low").
    7. "brandability": A brandability rating (string, e.g., "Excellent", "Good", "Fair", "Poor").
    8. "domain_age": An estimated or historical domain age (string, e.g., "New", "2 years", "Expired - 5 years old").
    9. "affiliate_link": A placeholder affiliate link for buying the domain (string, e.g., "https://example-registrar.com/buy?domain={domain_name}").

    Example of desired JSON output:
    {{
        "use_case": "An online platform for pet grooming services.",
        "flip_score": 88,
        "available": true,
        "estimated_value": "$1,500 - $3,000",
        "search_volume": "Medium",
        "seo_difficulty": "Low",
        "brandability": "Excellent",
        "domain_age": "New",
        "affiliate_link": "https://example-registrar.com/buy?domain=petgrooming.com"
    }}
    """

    headers = {
        'Content-Type': 'application/json'
    }
    params = {
        'key': GEMINI_API_KEY
    }
    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [
                    {"text": prompt}
                ]
            }
        ],
        "generationConfig": {
            "responseMimeType": "application/json",
            "responseSchema": {
                "type": "OBJECT",
                "properties": {
                    "use_case": { "type": "STRING" },
                    "flip_score": { "type": "NUMBER" },
                    "available": { "type": "BOOLEAN" },
                    "estimated_value": { "type": "STRING" },
                    "search_volume": { "type": "STRING" },
                    "seo_difficulty": { "type": "STRING" },
                    "brandability": { "type": "STRING" },
                    "domain_age": { "type": "STRING" },
                    "affiliate_link": { "type": "STRING" }
                },
                "required": ["use_case", "flip_score", "available", "estimated_value", 
                             "search_volume", "seo_difficulty", "brandability", 
                             "domain_age", "affiliate_link"]
            }
        }
    }

    try:
        response = requests.post(GEMINI_API_URL, headers=headers, params=params, json=payload, timeout=15) # Increased timeout slightly
        response.raise_for_status() # Raise an HTTPError for bad responses (4xx or 5xx)
        
        gemini_result = response.json()
        
        if gemini_result and gemini_result.get('candidates') and len(gemini_result['candidates']) > 0:
            json_string = gemini_result['candidates'][0]['content']['parts'][0]['text']
            parsed_json = json.loads(json_string) # Parse the string into a Python dict
            
            # Ensure the domain name in the response matches the requested one, or use the requested one
            parsed_json['name'] = domain_name 
            return parsed_json
        else:
            print("Gemini API did not return expected structure for prompt:", prompt)
            return None # Indicate a failure to get valid insights
    except requests.exceptions.RequestException as e:
        print(f"Error calling Gemini API for domain {domain_name}: {e}")
        return None # Indicate a critical API call failure
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON from Gemini API: {e}")
        print(f"Raw Gemini response (if available): {response.text if 'response' in locals() else 'N/A'}")
        return None # Indicate a critical response format error
    except Exception as e:
        print(f"An unexpected error occurred during Gemini insight generation for {domain_name}: {e}")
        return None # Indicate an unexpected failure


@app.route('/api/analyze-domain', methods=['POST'])
def analyze_domain():
    """
    API endpoint to analyze domain names based on a keyword and domain type.
    This now integrates with the Gemini API for dynamic insights for all attributes.
    If Gemini API fails for any domain, it returns a 500 error.
    """
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    keyword = data.get('keyword')
    domain_type = data.get('domainType')

    if not keyword or not domain_type:
        return jsonify({"error": "Missing keyword or domainType"}), 400

    print(f"Received request to analyze keyword: {keyword}, type: {domain_type}")

    potential_domains_for_analysis = []
    base_keyword = keyword.replace(' ', '').lower()

    # Define prefixes, suffixes, and TLDs for generating more diverse domain names
    prefixes = ["get", "the", "pro", "my", "e", "smart", "digital", "quick", "best", "top"]
    suffixes = ["solutions", "insights", "hub", "connect", "verse", "lab", "tech", "ify", "gen", "sphere"]
    tlds = [".com", ".net", ".org", ".io", ".co", ".ai", ".app", ".xyz"]

    # Generate a larger set of potential domain names
    generated_domains = set() # Use a set to store unique domain names

    # Strategy 1: Keyword + Suffix + TLD
    for suffix in suffixes:
        for tld in tlds:
            domain = f"{base_keyword}{suffix}{tld}"
            generated_domains.add(domain)

    # Strategy 2: Prefix + Keyword + TLD
    for prefix in prefixes:
        for tld in tlds:
            domain = f"{prefix}{base_keyword}{tld}"
            generated_domains.add(domain)
    
    # Strategy 3: Keyword + TLD (simple)
    for tld in tlds:
        generated_domains.add(f"{base_keyword}{tld}")

    # Convert set to list and shuffle to get some randomness
    potential_domains_for_analysis = list(generated_domains)
    import random
    random.shuffle(potential_domains_for_analysis)

    # Limit to a reasonable number for AI processing, e.g., top 10-15
    # If the user asks for more, we can increase this, but each Gemini call adds latency.
    potential_domains_for_analysis = potential_domains_for_analysis[:15] # Limiting to 15 for a good sample

    final_domains_with_insights = []
    
    for domain_name in potential_domains_for_analysis:
        # Get AI-generated insights for ALL domain attributes
        domain_insights = generate_gemini_domain_insights(keyword, domain_name)

        if domain_insights is None:
            # If generate_gemini_domain_insights explicitly returned None,
            # it means a critical error occurred with the Gemini API.
            # Immediately return a 500 error to the frontend.
            return jsonify({"error": "Failed to generate AI insights for domains. Please check Gemini API key or try again later."}), 500

        # Append the full dictionary of insights directly
        final_domains_with_insights.append(domain_insights)
    
    # Return the data with all AI insights (if no critical Gemini error occurred)
    return jsonify({"domains": final_domains_with_insights}), 200

# This block ensures the Flask development server runs only when the script is executed directly.
if __name__ == '__main__':
    # Run the Flask application in debug mode.
    # In a production environment, you would use a production-ready WSGI server
    # like Gunicorn or uWSGI.
    app.run(debug=True)
