from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
# Import the lightweight English SVM model
from profanity_check import predict_prob  

app = FastAPI(title="English AI Comment Moderation API")

# Configuration du CORS pour votre application Angular
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CommentRequest(BaseModel):
    content: str

@app.post("/v1/filter-comment")
async def filter_comment(request: CommentRequest):
    text_to_check = request.content
    
    # predict_prob expects an array, and returns an array of floats [0.0 to 1.0]
    try:
        probabilities = predict_prob([text_to_check])
        toxicity_score = float(probabilities[0])
    except Exception as e:
        print(f"Error checking text: {e}")
        toxicity_score = 0.0
        
    # Seuil de tolérance (0.50 means the AI is confident it is offensive/toxic)
    SEUIL = 0.50
    is_toxic = toxicity_score > SEUIL

    return {
        "content": text_to_check,
        "is_spam_or_toxic": is_toxic,
        "action": "REJECT" if is_toxic else "APPROVE",
        "reason": "AI Content Filter: High probability of offensive language detected" if is_toxic else "Clean text",
        "details": {
            "toxicity": round(toxicity_score, 4)
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)