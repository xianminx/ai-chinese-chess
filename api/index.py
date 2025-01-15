from fastapi import FastAPI, Request

### Create FastAPI instance with custom docs and openapi url
app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

async def get_request_info(request: Request, include_body: bool = False):
    """Helper function to get common request information"""
    info = {
        "message": "Hello from FastAPI",
        "path": request.url.path,
        "method": request.method,
        "headers": dict(request.headers),
        "query_params": dict(request.query_params),
        "client": {
            "host": request.client.host if request.client else None,
            "port": request.client.port if request.client else None
        },
        "url": str(request.url)
    }
    
    if include_body:
        try:
            info["body"] = await request.json()
        except:
            body = await request.body()
            info["body"] = body.decode() if body else None
            
    return info


@app.get("/api/py/hello")
async def hello(request: Request):
    return await get_request_info(request)

@app.post("/api/py/hello")
async def hello_post(request: Request):
    return await get_request_info(request, include_body=True)
